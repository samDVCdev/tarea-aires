# Sistema de Tickets de Aire Acondicionado - Guía Completa

## Descripción General

CoolTickets es un sistema profesional de gestión de tickets para reparación de aires acondicionados. Permite a los clientes solicitar reparaciones, a los técnicos trabajar en ellas, y a los administradores coordinar todo el proceso con un sistema de pagos integrado.

## Roles del Sistema

### 1. Cliente
- **Acceso a**: `/client/dashboard`
- **Funcionalidades**:
  - Ver todos sus tickets creados
  - Crear nuevos tickets de reparación
  - Monitorear el estado de sus equipos
  - Ver historial detallado de cambios de estado
  - Realizar pagos por reparaciones completadas

### 2. Técnico
- **Acceso a**: `/technician/dashboard`
- **Funcionalidades**:
  - Ver tickets asignados por el administrador
  - Actualizar estado de tickets (diagnóstico, reparado, etc.)
  - Especificar presupuesto y costo real de la reparación
  - Ver resumen de tickets asignados
  - Agregar notas y cambios de estado

### 3. Administrador
- **Acceso a**: `/admin/dashboard`
- **Funcionalidades**:
  - Dashboard con estadísticas generales
  - Gestión completa de tickets
  - Asignar tickets a técnicos
  - Gestionar inventario de equipos (CRUD)
  - Administrar usuarios y sus roles
  - Ver reportes y gráficos del sistema

## Estructura de la Base de Datos

### Tablas Principales

#### `user_profiles`
- Almacena perfiles de usuario con roles
- Campos: id, full_name, email, phone, role, created_at

#### `equipment`
- Catálogo de equipos de aire acondicionado disponibles
- Campos: id, brand, model, type, description, is_active

#### `tickets`
- Solicitudes de reparación
- Campos: id, client_id, equipment_id, description, status, assigned_to, budget, actual_cost, created_at, updated_at

#### `ticket_status_history`
- Historial de cambios de estado de cada ticket
- Campos: id, ticket_id, old_status, new_status, changed_by, reason, created_at

#### `payments`
- Registro de pagos con integración Stripe
- Campos: id, ticket_id, amount, status, stripe_payment_intent_id, paid_at

## Estados de los Tickets

1. **En Espera** - Ticket creado, esperando asignación
2. **Asignado** - Técnico asignado, esperando inicio
3. **Diagnóstico** - Técnico evaluando el problema
4. **Aprobado** - Presupuesto aprobado por cliente/admin
5. **Reparado** - Reparación completada, esperando inspección final
6. **Finalizado** - Ticket cerrado y listo para pagar
7. **Cancelado** - Ticket cancelado por cualquier razón

## Flujo de Trabajo

### Para un Cliente

1. **Registro**: Crear cuenta en `/auth/register`
2. **Crear Ticket**: Ir a `/client/new-ticket` y describir el problema
3. **Monitorear**: Ver estado en `/client/dashboard`
4. **Pagar**: Cuando el ticket esté aprobado/reparado, hacer clic en "Pagar"

### Para un Administrador

1. **Login**: Acceder con credenciales de admin
2. **Agregar Equipos**: Ir a `/admin/equipment` para crear el catálogo
3. **Gestionar Usuarios**: En `/admin/users` asignar roles
4. **Asignar Tickets**: En `/admin/tickets` seleccionar técnico para cada ticket
5. **Monitorear**: Ver estadísticas en `/admin/dashboard`

### Para un Técnico

1. **Login**: Acceder con credenciales de técnico
2. **Ver Asignaciones**: En `/technician/tickets` ver trabajos asignados
3. **Actualizar Estado**: Hacer clic en "Actualizar" para cambiar estado
4. **Especificar Costos**: Ingresar presupuesto y costo real
5. **Completar**: Cambiar a "Finalizado" cuando termine

## Configuración Inicial

### 1. Crear Equipos
El sistema necesita equipos para que los clientes puedan crear tickets:
- Admin → `/admin/equipment` → Agregar Equipo
- Ingresar: Marca, Modelo, Tipo (Split, Ventana, Portátil)

### 2. Crear Técnicos
Los técnicos deben ser creados primero:
- Admin → `/admin/users` → Cambiar rol a "Técnico"

### 3. Crear Clientes
Los clientes se pueden auto-registrar:
- Inicio → Registrarse
- Automáticamente obtienen rol de "Cliente"

## Integración con Stripe

El sistema soporta pagos con Stripe:

### Configuración Necesaria
1. Obtener claves de Stripe (PUBLISHABLE_KEY y SECRET_KEY)
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

### Flujo de Pago
1. Ticket llega a estado "Finalizado"
2. Cliente ve botón "Pagar"
3. Se crea Payment Intent en Stripe
4. Se redirige a checkout de Stripe
5. Pago confirmado actualiza la BD

## Variables de Entorno Necesarias

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## Rutas API

### POST `/api/create-payment`
Crea un Payment Intent en Stripe
- Body: `{ ticketId, amount, description }`
- Response: `{ clientSecret, paymentIntentId }`

## Seguridad

### Row Level Security (RLS)
- Cada usuario solo ve sus propios datos
- Técnicos solo ven tickets asignados
- Clientes solo ven sus tickets
- Admins ven todo

### Autenticación
- Basada en Supabase Auth
- Roles guardados en metadatos de usuario
- Middleware protege rutas según rol

## Problemas Comunes

### No aparecen los equipos en crear ticket
- Admin debe crear equipos en `/admin/equipment` primero

### No se puede asignar un técnico
- El técnico debe existir en la BD con rol "tecnico"
- Admin debe ir a `/admin/users` y cambiar el rol

### El botón de pagar no aparece
- El ticket debe estar en estado "aprobado", "reparado" o "finalizado"
- Debe tener presupuesto o costo real definido

### Error de autenticación
- Verificar que las variables de Supabase estén correctas
- Revisar que el usuario tenga rol asignado

## Próximas Mejoras Sugeridas

1. Confirmación de email para clientes
2. Notificaciones en tiempo real
3. Galería de fotos para tickets
4. Reportes PDF
5. Sistema de calificaciones
6. Chat entre técnico y cliente
7. Exportación de datos
8. Calendario de disponibilidad de técnicos

## Support

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.
