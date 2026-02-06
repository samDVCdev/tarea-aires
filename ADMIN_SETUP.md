# Crear Usuario Administrador - Guía Completa

## Opción 1: Crear Admin Directamente en Supabase (Recomendado)

### Paso 1: Ir a Supabase Dashboard
1. Accede a tu proyecto en [Supabase](https://supabase.com)
2. En el menú izquierdo, haz clic en **Authentication**
3. Luego haz clic en **Users**

### Paso 2: Agregar Nuevo Usuario
1. Haz clic en el botón **Add user** (verde, arriba a la derecha)
2. Selecciona **Create new user**

### Paso 3: Llenar los Datos
- **Email**: `admin@cooltickets.com`
- **Password**: Crea una contraseña fuerte, ejemplo: `AdminSecure123!@#`
- **Confirm password**: Repite la contraseña
- Haz clic en **Save user**

### Paso 4: Ejecutar SQL para Asignar Rol Admin

1. En Supabase, ve a **SQL Editor** (en el menú izquierdo)
2. Haz clic en **New Query**
3. Copia y pega este SQL:

```sql
UPDATE public.user_profiles 
SET role = 'administrador', full_name = 'Administrador'
WHERE email = 'admin@cooltickets.com';
```

4. Haz clic en **Run** (el botón verde de play)

## Opción 2: Ejecutar TODO el Script Completo

Si quieres crear todo de una vez (tablas + datos + usuarios):

### Paso 1: Ir a SQL Editor
1. En Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**

### Paso 2: Copiar el Script Completo
Abre el archivo `MIGRATION_COMPLETE.sql` en el proyecto y copia TODO el contenido.

### Paso 3: Ejecutar el Script
1. Pega el contenido en el SQL Editor de Supabase
2. Haz clic en **Run**

### Paso 4: Crear Usuario Admin en Supabase
1. Ve a **Authentication > Users**
2. Haz clic en **Add user**
3. Email: `admin@cooltickets.com`
4. Password: `AdminSecure123!@#`
5. Haz clic en **Save user**

### Paso 5: Asignar Rol
Vuelve a **SQL Editor** y ejecuta:

```sql
UPDATE public.user_profiles 
SET role = 'administrador', full_name = 'Administrador del Sistema'
WHERE email = 'admin@cooltickets.com';
```

## Crear Usuarios Técnicos (Opcional)

Para crear técnicos, sigue el mismo proceso pero con estos datos:

### Técnico 1
- Email: `tecnico1@cooltickets.com`
- Password: `Tecnico123!@#`

Luego ejecuta en SQL Editor:
```sql
UPDATE public.user_profiles 
SET role = 'tecnico', full_name = 'Juan García - Técnico'
WHERE email = 'tecnico1@cooltickets.com';
```

### Técnico 2
- Email: `tecnico2@cooltickets.com`
- Password: `Tecnico456!@#`

Luego ejecuta en SQL Editor:
```sql
UPDATE public.user_profiles 
SET role = 'tecnico', full_name = 'María López - Técnica'
WHERE email = 'tecnico2@cooltickets.com';
```

## Verificar que Todo Funciona

En **SQL Editor**, ejecuta:

```sql
SELECT id, email, full_name, role, created_at FROM public.user_profiles ORDER BY created_at DESC;
```

Deberías ver algo como:
```
id                                    email                    full_name                    role            created_at
12345678-abcd-efgh-ijkl-mnopqrstuv   admin@cooltickets.com    Administrador del Sistema   administrador   2024-01-15 10:30:00
87654321-dcba-hgfe-lkji-vustqrponm   tecnico1@cooltickets.com Juan García - Técnico      tecnico         2024-01-15 10:32:00
```

## Ingresar al Sistema

### URL de Ingreso
```
http://localhost:3000/auth/login
```

### Credenciales Admin
- **Email**: `admin@cooltickets.com`
- **Password**: `AdminSecure123!@#` (o la que hayas creado)

### Después de Ingresar
1. Deberías ver el **Dashboard del Administrador**
2. Desde aquí puedes:
   - Gestionar equipos
   - Ver todos los tickets
   - Asignar tickets a técnicos
   - Gestionar usuarios

## Solucionar Problemas

### "Email ya existe"
Si ves este error, significa que el usuario ya fue creado. 
- Busca el usuario en **Authentication > Users**
- Borra la contraseña anterior o usa otro email

### "No veo el dashboard del admin"
- Verifica que el `role` en `user_profiles` sea `administrador`
- Ejecuta: `SELECT role FROM public.user_profiles WHERE email = 'admin@cooltickets.com';`
- Debe devolver: `administrador`

### Las tablas no existen
- Asegúrate de ejecutar el script completo `MIGRATION_COMPLETE.sql`
- Verifica que no haya errores en SQL Editor
- Actualiza el navegador si es necesario

## Credenciales de Ejemplo (Para Prueba)

```
ADMIN
Email: admin@cooltickets.com
Password: AdminSecure123!@#

TÉCNICO 1
Email: tecnico1@cooltickets.com
Password: Tecnico123!@#

TÉCNICO 2
Email: tecnico2@cooltickets.com
Password: Tecnico456!@#

CLIENTE (para pruebas)
Email: cliente@cooltickets.com
Password: Cliente123!@#
```
