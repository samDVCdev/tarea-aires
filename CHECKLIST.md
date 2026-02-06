# ✅ Checklist de Configuración - Sistema de Tickets de Aire Acondicionado

## Paso 1: Base de Datos Supabase
- [ ] Abre tu proyecto Supabase
- [ ] Ve a SQL Editor
- [ ] Copia TODO el contenido de `SUPABASE_INIT.sql`
- [ ] Pégalo en Supabase SQL Editor
- [ ] Ejecuta el script (click en RUN)
- [ ] Verifica que no haya errores (deberías ver "Success")

## Paso 2: Crear Usuario Administrador
- [ ] Ve a Authentication → Users
- [ ] Click en "Add user"
- [ ] Email: `admin@example.com`
- [ ] Password: `AdminPassword123!`
- [ ] Click "Create user"
- [ ] Ve a SQL Editor nuevamente
- [ ] Ejecuta este comando:
  ```sql
  UPDATE public.user_profiles 
  SET role = 'administrador' 
  WHERE email = 'admin@example.com';
  ```

## Paso 3: Variables de Entorno
- [ ] Abre tu proyecto en Vercel
- [ ] Ve a Settings → Environment Variables (o "Vars" en v0)
- [ ] Verifica que estas variables existan:
  - `NEXT_PUBLIC_SUPABASE_URL` (debe tener tu URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (debe tener tu clave)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (obtén de Stripe)
  - `STRIPE_SECRET_KEY` (obtén de Stripe)

### Obtener Claves Stripe
1. Ve a https://dashboard.stripe.com
2. Ve a "Developers" → "API keys"
3. Copia la clave publicable
4. Copia la clave secreta
5. Añade ambas a tus variables de entorno

## Paso 4: Prueba Inicial
- [ ] Abre tu app en el navegador
- [ ] Deberías ver la landing page
- [ ] Haz click en "Registrarse"
- [ ] Crea una cuenta de cliente
- [ ] Verifica tu email (Supabase puede permitir sin verificación en desarrollo)
- [ ] Ingresa al dashboard del cliente

## Paso 5: Prueba con Admin
- [ ] Abre el URL de tu app
- [ ] Ve a `/auth/login`
- [ ] Ingresa con admin@example.com / AdminPassword123!
- [ ] Deberías ver el Admin Dashboard
- [ ] Ve a "Equipment" y verifica que veas los equipos por defecto

## Paso 6: Crear Usuario Técnico (Opcional pero Recomendado)
- [ ] En el Admin Dashboard, ve a "Usuarios"
- [ ] O crea un usuario en Authentication de Supabase
- [ ] Actualiza su rol a técnico:
  ```sql
  UPDATE public.user_profiles 
  SET role = 'tecnico' 
  WHERE email = 'tecnico@example.com';
  ```

## Prueba Completa del Flujo
1. [ ] **Como Cliente:**
   - Crea un nuevo ticket
   - Selecciona un equipo
   - Describe el problema
   - Ve tu ticket en el dashboard (estado: "En Espera")

2. [ ] **Como Admin:**
   - Ve a Admin Dashboard
   - En Tickets, busca tu ticket
   - Asigna el ticket a un técnico
   - Ver que el estado cambió a "Asignado"

3. [ ] **Como Técnico:**
   - Ingresa con tu cuenta técnico
   - Ve el ticket asignado
   - Actualiza el estado a "Diagnostico"
   - Añade presupuesto
   - Cambia a "Aprobado"
   - Cambia a "Reparado"
   - Registra costo real

4. [ ] **Como Cliente (nuevamente):**
   - Ingresa a tu dashboard
   - Ve que el ticket ahora está "Reparado"
   - Haz click en "Pagar"
   - Usa tarjeta de prueba de Stripe: `4242 4242 4242 4242`
   - Cualquier fecha futura
   - Cualquier CVC
   - Completa el pago

5. [ ] **Verifica que el ticket ahora esté "Finalizado"**

## Errores Comunes

### Error: "Module not found: @/lib/supabase/proxy"
- **Solución:** Este archivo debe existir en `lib/supabase/proxy.ts`
- Ya está creado automáticamente

### Error: "Row level security violation"
- **Solución:** No ejecutaste el script SQL completamente
- Asegúrate de ejecutar TODO el contenido de SUPABASE_INIT.sql

### Error: "Auth error" o no puedes ingresa
- **Solución:** 
  - Verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY sean correctas
  - Asegúrate de que el usuario existe en Supabase

### Error: Stripe no funciona
- **Solución:**
  - Verifica que NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY sea correcto
  - Verifica que STRIPE_SECRET_KEY sea correcto
  - En desarrollo, usa tarjetas de prueba de Stripe

### El sistema es lento al cargar datos
- **Solución:** Normal en la primera carga. Supabase puede tardar un momento
- Si persiste, verifica los índices en la base de datos

## Lo que Debe Funcionar

✅ Registro de usuarios
✅ Login/Logout
✅ Crear tickets
✅ Ver tickets según rol
✅ Cambiar estado de tickets
✅ Historial de cambios
✅ Pagos con Stripe
✅ Gráficos y estadísticas
✅ Gestión de equipos
✅ Gestión de usuarios y roles

## ¿Qué Hacer Ahora?

1. **Completar la Checklist** - Sigue todos los pasos
2. **Probar el Sistema** - Haz el flujo completo
3. **Personalizar** - Modifica equipos según tus necesidades
4. **Conectar Stripe Real** - Usa tus claves de producción cuando estés listo
5. **Desplegar** - Haz push a GitHub y Vercel desplegará automáticamente

## Contacto / Ayuda

Si algo no funciona:
1. Lee README.md
2. Lee SETUP.md
3. Revisa los logs de Supabase
4. Verifica las variables de entorno
5. Asegúrate de haber ejecutado el script SQL

---

**¡Felicidades! Tu sistema está casi listo. Solo necesitas completar esta checklist.**
