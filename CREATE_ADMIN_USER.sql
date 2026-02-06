-- ============================================================
-- CREAR USUARIO ADMIN EN SUPABASE
-- ============================================================
-- 
-- OPCIÓN 1: Si ya tienes el usuario admin creado en Authentication
-- Ejecuta SOLO este SQL:

UPDATE public.user_profiles 
SET role = 'administrador', full_name = 'Administrador del Sistema'
WHERE email = 'admin@cooltickets.com';

-- Verifica que funcionó:
SELECT id, email, full_name, role FROM public.user_profiles WHERE email = 'admin@cooltickets.com';

-- ============================================================
-- OPCIÓN 2: Crear usuario admin usando la función auth.admin
-- (Esto requiere usar la API de Supabase, no SQL directo)
-- 
-- Si quieres crear el usuario desde SQL, necesitas hacerlo
-- directamente desde el Dashboard de Supabase:
--
-- 1. Ve a Authentication > Users
-- 2. Haz clic en "Add user"
-- 3. Email: admin@cooltickets.com
-- 4. Password: AdminSecure123!@# (o una segura)
-- 5. Haz clic en "Save user"
-- 
-- Luego ejecuta el SQL de OPCIÓN 1
--
-- ============================================================
-- CREAR USUARIOS TÉCNICOS DE PRUEBA
-- ============================================================

-- Después de crear los técnicos en Authentication, ejecuta:

UPDATE public.user_profiles 
SET role = 'tecnico', full_name = 'Técnico Juan García'
WHERE email = 'tecnico1@cooltickets.com';

UPDATE public.user_profiles 
SET role = 'tecnico', full_name = 'Técnica María López'
WHERE email = 'tecnico2@cooltickets.com';

-- Verificar todos los usuarios creados:
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  created_at 
FROM public.user_profiles 
ORDER BY created_at DESC;
