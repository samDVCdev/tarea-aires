# Sistema de Gestión de Tickets de Aire Acondicionado

Un sistema completo y profesional para gestionar solicitudes de reparación de aire acondicionado con roles de usuario, seguimiento de estado, y pagos integrados con Stripe.

## 🎯 Características Principales

### 👥 Tres Roles de Usuario

- **Cliente**: Crea solicitudes de reparación, ve el estado de sus tickets, realiza pagos
- **Técnico**: Recibe asignaciones, actualiza estado del trabajo, especifica presupuesto y costo
- **Administrador**: Gestiona tickets, asigna técnicos, administra equipos y usuarios

### 🎟️ Sistema de Estados de Tickets

Los tickets pasan por los siguientes estados:
1. **En Espera** - Cliente crea el ticket
2. **Asignado** - Admin asigna a un técnico
3. **Diagnóstico** - Técnico diagnóstica el problema
4. **Aprobado** - Técnico especifica presupuesto
5. **Reparado** - Se completa la reparación
6. **Finalizado** - Se registra costo real y se debe pagar
7. **Cancelado** - Se cancela el ticket

Cada cambio de estado registra:
- Quién hizo el cambio
- Cuándo se hizo
- Por qué se hizo (razón)

### 💳 Pagos con Stripe

- Integración completa de Stripe
- Los clientes pagan solo después que se aprueba el trabajo
- Registro de pagos en la base de datos
- Estados de pago: pendiente, completado

### 🛠️ CRUD de Equipos

- Crear, editar, eliminar equipos
- Información de marca, modelo, descripción
- Rango de precios

### 📊 Dashboards Inteligentes

- **Dashboard Cliente**: Ve sus tickets, estado actual, histórico
- **Dashboard Técnico**: Ve asignaciones pendientes, estadísticas de trabajo
- **Dashboard Administrador**: Resumen general, gráficos de tickets, estadísticas

## 🚀 Inicio Rápido

### 1. Inicializar Base de Datos

Sigue las instrucciones en `SETUP.md` para:
1. Copiar el contenido de `SUPABASE_INIT.sql`
2. Ejecutar en el SQL Editor de Supabase
3. Crear usuario administrador

### 2. Configurar Variables de Entorno

Las claves Supabase y Stripe deben estar en las variables de entorno (Vars section en Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
```

### 3. Ejecutar Localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## 📁 Estructura del Proyecto

```
app/
├── page.tsx                          # Landing page pública
├── auth/                             # Autenticación
│   ├── register/page.tsx            # Registro de clientes
│   ├── login/page.tsx               # Login
│   └── ...
├── client/                           # Dashboard del cliente
│   ├── dashboard/page.tsx           # Ver sus tickets
│   ├── new-ticket/page.tsx          # Crear nuevo ticket
│   └── payment/[ticketId]/page.tsx  # Página de pago
├── technician/                       # Dashboard del técnico
│   ├── dashboard/page.tsx           # Estadísticas
│   └── tickets/page.tsx             # Gestionar tickets
└── admin/                            # Dashboard del admin
    ├── dashboard/page.tsx           # Resumen general
    ├── tickets/page.tsx             # Asignar tickets
    ├── equipment/page.tsx           # Gestionar equipos
    └── users/page.tsx               # Gestionar usuarios

lib/
├── supabase/                         # Clientes Supabase
│   ├── client.ts                    # Cliente del navegador
│   ├── server.ts                    # Cliente del servidor
│   └── proxy.ts                     # Manejo de sesiones
├── auth.ts                           # Funciones de autenticación
└── ticket-utils.ts                  # Utilidades para tickets

scripts/
├── setup-database.sql               # Script de inicialización
└── ...
```

## 🔑 Autenticación y Seguridad

- Autenticación con Supabase
- Row Level Security (RLS) en todas las tablas
- Cada usuario solo ve sus propios datos
- Admins pueden ver todo
- Técnicos ven solo sus tickets asignados

## 🎨 UI/UX

- Diseño moderno con Tailwind CSS
- Componentes reutilizables con shadcn/ui
- Gráficos interactivos con Recharts
- Notificaciones con Sonner
- Soporte para tema claro/oscuro

## 📚 Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe
- **Gráficos**: Recharts
- **Tablas**: shadcn/ui Tables
- **Notificaciones**: Sonner

## 🔧 Configuración de Supabase

La base de datos incluye:

- **user_profiles**: Perfiles de usuarios con roles
- **equipment**: Inventario de equipos
- **tickets**: Solicitudes de reparación
- **ticket_status_history**: Historial de cambios
- **payments**: Registro de pagos

Todas las tablas tienen RLS habilitado para seguridad.

## 📋 Uso del Sistema

### Como Cliente

1. Registrate en `/auth/register`
2. Ve a tu dashboard
3. Haz clic en "Nuevo Ticket"
4. Selecciona el equipo y describe el problema
5. Espera a que el admin lo asigne
6. Un técnico lo reparará
7. Paga cuando esté listo

### Como Técnico

1. Ingresa con tu cuenta
2. Ve "Mis Tickets" en el dashboard
3. Revisa los tickets asignados
4. Actualiza el estado según avances
5. Especifica el presupuesto inicial
6. Una vez reparado, registra el costo real

### Como Administrador

1. Ingresa con tu cuenta admin
2. Dashboard muestra resumen general
3. En "Tickets": asigna a técnicos
4. En "Equipos": gestiona catálogo
5. En "Usuarios": cambia roles
6. En "Pagos": ve historial

## 🐛 Solución de Problemas

Ver `SETUP.md` para errores comunes y soluciones.

## 📞 Soporte

Si encuentras problemas:
1. Revisa `SETUP.md` para errores comunes
2. Verifica las variables de entorno
3. Asegúrate de haber ejecutado el script SQL
4. Revisa los logs de Supabase

## 📝 Licencia

Este proyecto es de código abierto.

---

**¡Listo para usar! Sigue las instrucciones en SETUP.md para empezar.**
