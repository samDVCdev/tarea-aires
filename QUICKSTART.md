# Inicio Rápido - Sistema de Tickets de Aire Acondicionado

## Pasos Iniciales

### 1. Configurar Supabase
1. Ve a tu proyecto de Supabase
2. Abre la consola SQL
3. Ejecuta los scripts en orden:
   - `scripts/init-database.sql` (crea tablas)
   - `scripts/seed-data.sql` (inserta datos de prueba)

### 2. Configurar Variables de Entorno
En tu proyecto, ve a **Vars** en la barra lateral y agrega:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_public_key
STRIPE_SECRET_KEY=tu_stripe_secret_key
```

### 3. Crear Primera Cuenta de Admin
1. Regístrate en `/auth/register` con un email
2. Confirma tu email
3. En Supabase, ve a `user_profiles` y cambia el role a `administrador`

### 4. Crear Equipos (Admin)
1. Inicia sesión como admin
2. Ve a `/admin/equipment`
3. Haz clic en "Agregar Equipo"
4. Llena los datos (Marca, Modelo, Tipo)

### 5. Crear Técnicos (Admin)
1. Ve a `/admin/users`
2. Registra nuevos usuarios como clientes
3. Cambia su role a `tecnico` desde la tabla

### 6. Probar el Sistema

**Como Cliente:**
1. Regístrate en `/auth/register`
2. Ve a `/client/dashboard`
3. Crea un nuevo ticket en "Nuevo Ticket"
4. Selecciona un equipo y describe el problema

**Como Admin:**
1. Ve a `/admin/tickets`
2. Busca el ticket del cliente
3. Haz clic en "Asignar"
4. Selecciona un técnico

**Como Técnico:**
1. Inicia sesión con tu cuenta
2. Ve a `/technician/tickets`
3. Verás los tickets asignados
4. Haz clic en "Actualizar" para cambiar estado
5. Especifica presupuesto y costo real

**Para Pagar (Cliente):**
1. Espera a que el técnico complete la reparación
2. Ve a tu dashboard
3. Si está en "Aprobado", "Reparado" o "Finalizado", verás el botón "Pagar"
4. Haz clic para proceder al pago con Stripe

## Rutas Principales

### Públicas
- `/` - Página de inicio
- `/auth/register` - Registro
- `/auth/login` - Login

### Cliente (después de login)
- `/client/dashboard` - Ver mis tickets
- `/client/new-ticket` - Crear nuevo ticket
- `/client/payment/[ticketId]` - Pagar reparación

### Técnico (después de login)
- `/technician/dashboard` - Mi dashboard
- `/technician/tickets` - Mis tickets asignados

### Admin (después de login)
- `/admin/dashboard` - Dashboard general
- `/admin/tickets` - Gestionar todos los tickets
- `/admin/equipment` - Gestionar equipos
- `/admin/users` - Gestionar usuarios

## Datos de Prueba

El script `seed-data.sql` incluye:
- 6 modelos de aire acondicionado diferentes
- Diferentes tipos: Split, Ventana, Portátil
- Marcas: Samsung, LG, Daikin, Electrolux, Whirlpool, Midea

## Tips

1. **Cambiar roles**: En Admin → Users, selecciona el rol del dropdown
2. **Asignar tickets**: Admin → Tickets → Asignar
3. **Ver historial**: En Client Dashboard, haz clic en "Ver" en un ticket
4. **Actualizar costos**: Técnico → Tickets → Actualizar (especifica presupuesto y costo real)

## Troubleshooting

| Problema | Solución |
|----------|----------|
| No aparecen equipos al crear ticket | Crea equipos primero en Admin → Equipment |
| No puedo asignar técnico | El usuario debe tener rol "tecnico" en Users |
| Botón pagar no aparece | El ticket debe tener presupuesto/costo real y estar aprobado/reparado |
| Error de autenticación | Verifica que las variables de Supabase sean correctas |

## Siguiente

Una vez que el sistema esté funcionando:
1. Personaliza colores y branding
2. Agrega más equipos según tu catálogo
3. Configura Stripe para producción
4. Prueba el flujo completo de pago

Ver `SYSTEM_GUIDE.md` para documentación completa.
