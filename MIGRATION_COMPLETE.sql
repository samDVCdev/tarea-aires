-- ============================================================
-- COOL TICKETS - SISTEMA DE GESTIÓN DE TICKETS DE AC
-- SCRIPT COMPLETO DE MIGRACIÓN Y SETUP
-- ============================================================

-- 1. CREAR TABLAS
-- ============================================================

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('cliente', 'tecnico', 'administrador')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  description TEXT,
  min_price DECIMAL(10, 2),
  max_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de tickets
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'en_espera' CHECK (status IN ('en_espera', 'asignado', 'diagnostico', 'aprobado', 'reparado', 'finalizado', 'cancelado')),
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de historial de estados
CREATE TABLE IF NOT EXISTS public.ticket_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL CHECK (new_status IN ('en_espera', 'asignado', 'diagnostico', 'aprobado', 'reparado', 'finalizado', 'cancelado')),
  changed_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. CREAR ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_technician_id ON public.tickets(technician_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_status_history_ticket_id ON public.ticket_status_history(ticket_id);
CREATE INDEX IF NOT EXISTS idx_payments_ticket_id ON public.payments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- ============================================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. CREAR POLÍTICAS RLS
-- ============================================================

-- USER_PROFILES
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

-- EQUIPMENT
CREATE POLICY "Everyone can view equipment" ON public.equipment
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert equipment" ON public.equipment
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Admins can update equipment" ON public.equipment
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Admins can delete equipment" ON public.equipment
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

-- TICKETS
CREATE POLICY "Clients can view their own tickets" ON public.tickets
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Technicians can view assigned tickets" ON public.tickets
  FOR SELECT USING (
    auth.uid() = technician_id OR 
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Admins can view all tickets" ON public.tickets
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Clients can insert their own tickets" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Technicians can update assigned tickets" ON public.tickets
  FOR UPDATE USING (
    auth.uid() = technician_id OR 
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Admins can update all tickets" ON public.tickets
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

-- TICKET_STATUS_HISTORY
CREATE POLICY "Users can view history of their tickets" ON public.ticket_status_history
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM public.tickets WHERE client_id = auth.uid()
    ) OR
    ticket_id IN (
      SELECT id FROM public.tickets WHERE technician_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Technicians and admins can insert history" ON public.ticket_status_history
  FOR INSERT WITH CHECK (
    auth.uid() = changed_by AND (
      auth.uid() IN (
        SELECT id FROM public.user_profiles WHERE role IN ('tecnico', 'administrador')
      )
    )
  );

-- PAYMENTS
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all payments" ON public.payments
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles WHERE role = 'administrador'
    )
  );

-- ============================================================
-- 5. CREAR TRIGGER PARA AUTO-CREAR PERFIL
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'role', 'cliente')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. INSERTAR DATOS DE PRUEBA - EQUIPOS
-- ============================================================

DELETE FROM public.equipment;

INSERT INTO public.equipment (name, brand, model, description, min_price, max_price) VALUES
('Aire Acondicionado 1 Tonelada', 'Samsung', 'AR12000', 'Aire acondicionado de 1 tonelada, frío/calor', 150.00, 250.00),
('Aire Acondicionado 1.5 Toneladas', 'LG', 'LS15TN', 'Aire acondicionado de 1.5 toneladas, inverter', 200.00, 350.00),
('Aire Acondicionado 2 Toneladas', 'Carrier', 'CAR2000', 'Aire acondicionado de 2 toneladas, turbo', 250.00, 400.00),
('Aire Acondicionado 2.5 Toneladas', 'Panasonic', 'PANA2500', 'Aire acondicionado de 2.5 toneladas, eco-smart', 300.00, 500.00),
('Aire Acondicionado 3 Toneladas', 'Midea', 'MID3000', 'Aire acondicionado de 3 toneladas, silencioso', 350.00, 600.00);

-- ============================================================
-- 7. INSERTAR USUARIO ADMIN (NECESITAS HACERLO MANUALMENTE)
-- ============================================================

-- ⚠️ IMPORTANTE: Debes crear el usuario admin en Supabase manualmente así:
-- 1. Ve a Authentication > Users en tu proyecto Supabase
-- 2. Haz clic en "Add user"
-- 3. Email: admin@cooltickets.com
-- 4. Password: TuPasswordSeguro123
-- 5. Luego ejecuta este SQL para asignarle el rol:

-- UPDATE public.user_profiles 
-- SET role = 'administrador'
-- WHERE email = 'admin@cooltickets.com';

-- ============================================================
-- 8. CREAR USUARIOS TÉCNICOS DE PRUEBA
-- ============================================================

-- ⚠️ TAMBIÉN NECESITAS crear usuarios técnicos en Supabase:
-- 1. Email: tecnico1@cooltickets.com
-- 2. Email: tecnico2@cooltickets.com
-- Luego ejecuta esto:

-- UPDATE public.user_profiles 
-- SET role = 'tecnico', full_name = 'Técnico 1'
-- WHERE email = 'tecnico1@cooltickets.com';

-- UPDATE public.user_profiles 
-- SET role = 'tecnico', full_name = 'Técnico 2'
-- WHERE email = 'tecnico2@cooltickets.com';

-- ============================================================
-- 9. VERIFICAR QUE TODO FUNCIONÓ
-- ============================================================

-- Ejecuta estas queries para verificar:
-- SELECT * FROM public.equipment;
-- SELECT * FROM public.user_profiles;
-- SELECT * FROM public.tickets;
