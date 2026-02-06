# Setup - Sistema de Tickets de Aire Acondicionado

## Paso 1: Inicializar la Base de Datos

1. Ve a tu proyecto Supabase en https://supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú izquierdo
4. Crea una nueva consulta (o pega en una existente)
5. Copia TODO el contenido del archivo `SUPABASE_INIT.sql` de este proyecto
6. Pégalo en el editor SQL de Supabase
7. Haz clic en **"RUN"** (botón azul con play)

**Espera a que se complete.** Deberías ver un mensaje de éxito sin errores.

## Paso 2: Crear Usuario Administrador

Una vez se complete el script, necesitas crear un usuario administrador:

1. Ve a **Authentication** → **Users** en Supabase
2. Haz clic en **"Add user"**
3. Ingresa:
   - **Email:** admin@example.com
   - **Password:** AdminPassword123!
   - Haz clic en **"Create user"**

4. Ahora necesitas actualizar el rol de este usuario a administrador. Ve a **SQL Editor** nuevamente
5. Copia y ejecuta esto:

```sql
UPDATE public.user_profiles 
SET role = 'administrador' 
WHERE email = 'admin@example.com';
```

## Paso 3: Crear Técnicos de Prueba (Opcional)

Para probar el sistema con técnicos, crea más usuarios:

1. En **Authentication** → **Users**, añade usuarios con emails como:
   - tecnico1@example.com
   - tecnico2@example.com

2. Actualiza sus roles en SQL Editor:

```sql
UPDATE public.user_profiles 
SET role = 'tecnico' 
WHERE email IN ('tecnico1@example.com', 'tecnico2@example.com');
```

## Paso 4: Configurar Variables de Entorno

El sistema necesita dos claves de integración:

### Supabase (Ya debería estar configurado)
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave pública

### Stripe (Para pagos)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Clave publicable de Stripe
- `STRIPE_SECRET_KEY` - Clave secreta de Stripe

Ve a la sección **Vars** del panel de Vercel para añadirlas.

## Paso 5: Iniciar el Sistema

1. El sistema ya está listo para usarse
2. Abre tu aplicación
3. Ve a la página de **Registro** y crea una cuenta de cliente
4. O ingresa con el usuario admin que creaste

## Flujo de Prueba Completo

### Como Cliente:
1. Registrate o ingresa
2. Ve a **Dashboard** → **Nuevo Ticket**
3. Crea un ticket seleccionando un equipo
4. Verás tu ticket en el dashboard

### Como Administrador:
1. Ingresa con admin@example.com
2. Ve a **Admin Dashboard**
3. En **Tickets**, asigna el ticket a un técnico
4. En **Equipos**, gestiona los equipos disponibles
5. En **Usuarios**, cambia roles de usuarios

### Como Técnico:
1. Ingresa con tecnico@example.com
2. Ve a **Technician Dashboard**
3. Verás los tickets asignados
4. Haz clic en un ticket y actualiza su estado
5. Añade presupuesto y costo real
6. El cliente verá los cambios

## Errores Comunes

### "Module not found: @/lib/supabase/proxy"
- **Solución:** Usa el middleware.ts que está en el proyecto (ya está arreglado)

### "Row level security violation"
- **Solución:** Asegúrate de haber ejecutado TODO el script SUPABASE_INIT.sql
- Verifica que las políticas de RLS estén creadas

### "Auth error" en login
- **Solución:** Verifica que las variables de entorno de Supabase estén correctas
- Asegúrate de que el usuario existe en Supabase

## Estructura del Sistema

```
Cliente → Solicita Ticket
    ↓
Admin → Asigna a Técnico
    ↓
Técnico → Actualiza Estado
    ↓
Admin/Técnico → Establece Presupuesto
    ↓
Cliente → Paga con Stripe
    ↓
Ticket → Finalizado
```

## Pasos Siguientes

1. Prueba todos los flujos
2. Personaliza equipos según tus necesidades
3. Configura tu cuenta Stripe para recibir pagos
4. Despliega a Vercel cuando estés listo

¡El sistema está listo para usar!
