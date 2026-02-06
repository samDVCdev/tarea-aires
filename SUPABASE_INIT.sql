-- Copy this entire script into Supabase SQL Editor and execute it

-- Create tables
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('cliente', 'tecnico', 'administrador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'en_espera' CHECK (status IN ('en_espera', 'asignado', 'diagnostico', 'aprobado', 'reparado', 'finalizado', 'cancelado')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.ticket_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL CHECK (new_status IN ('en_espera', 'asignado', 'diagnostico', 'aprobado', 'reparado', 'finalizado', 'cancelado')),
  changed_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'administrador'
    )
  );

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for equipment
CREATE POLICY "Everyone can view equipment" ON public.equipment
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage equipment" ON public.equipment
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- Create policies for tickets
CREATE POLICY "Clients can view their own tickets" ON public.tickets
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Technicians can view assigned tickets" ON public.tickets
  FOR SELECT USING (technician_id = auth.uid());

CREATE POLICY "Admins can view all tickets" ON public.tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'administrador'
    )
  );

CREATE POLICY "Clients can create tickets" ON public.tickets
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'cliente'
    )
  );

CREATE POLICY "Technicians can update assigned tickets" ON public.tickets
  FOR UPDATE USING (
    technician_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'administrador'
    )
  );

CREATE POLICY "Admins can update all tickets" ON public.tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'administrador'
    )
  );

-- Create policies for ticket_status_history
CREATE POLICY "Users can view history of their tickets" ON public.ticket_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE id = ticket_id AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all history" ON public.ticket_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'administrador'
    )
  );

CREATE POLICY "Authorized users can insert history" ON public.ticket_status_history
  FOR INSERT WITH CHECK (changed_by = auth.uid());

-- Create policies for payments
CREATE POLICY "Clients can view their payments" ON public.payments
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'administrador'
    )
  );

CREATE POLICY "Clients can create payments" ON public.payments
  FOR INSERT WITH CHECK (client_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_technician_id ON public.tickets(technician_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_status_history_ticket_id ON public.ticket_status_history(ticket_id);
CREATE INDEX IF NOT EXISTS idx_payments_ticket_id ON public.payments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON public.payments(client_id);

-- Create trigger function for auto-creating profile
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

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default equipment
INSERT INTO public.equipment (name, brand, model, description, price_range) VALUES
('Split Air Conditioner', 'LG', 'LS1200HSV', 'High efficiency split system', '$800-$1500'),
('Window Air Conditioner', 'Midea', 'MWA18CR61', 'Standard window unit', '$300-$600'),
('Central Air System', 'Carrier', '25HCS548', 'Large central system', '$3000-$5000'),
('Portable Air Conditioner', 'Frigidaire', 'FFPA051WAE', 'Portable cooling unit', '$400-$700'),
('Ductless Mini Split', 'Daikin', 'FTXS09LVJU', 'Wall-mounted mini split', '$1200-$2000')
ON CONFLICT DO NOTHING;
