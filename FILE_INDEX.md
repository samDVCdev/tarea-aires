# Índice de Archivos del Proyecto

## 📖 Documentación Principal (EMPEZAR AQUÍ)

```
QUICK_START.md                 ← Guía de 5 minutos para comenzar
ADMIN_SETUP.md                 ← Cómo crear usuario administrador
MIGRATION_COMPLETE.sql         ← Script SQL completo (tablas + datos)
CREATE_ADMIN_USER.sql          ← Script para crear solo el admin
.env.example                   ← Variables de entorno necesarias
```

## 🗄️ Base de Datos

```
MIGRATION_COMPLETE.sql         - Crea todas las tablas, índices, RLS y datos
CREATE_ADMIN_USER.sql          - Asigna rol admin a usuarios
scripts/001_create_tables.sql  - Script de tablas (alternativo)
scripts/002_enable_rls.sql     - Script de RLS (alternativo)
scripts/003_profile_trigger.sql- Script del trigger (alternativo)
scripts/seed-data.sql          - Datos de prueba (alternativo)
```

## 🔐 Autenticación

```
lib/supabase/client.ts         - Cliente Supabase para navegador
lib/supabase/server.ts         - Cliente Supabase para servidor
lib/supabase/proxy.ts          - Manejo de cookies y sesiones
middleware.ts                  - Middleware de Next.js
lib/auth.ts                    - Funciones de autenticación helpers
```

## 📄 Páginas Públicas

```
app/page.tsx                   - Landing page principal
app/auth/login/page.tsx        - Página de login
app/auth/register/page.tsx     - Página de registro
app/auth/register-success/page.tsx    - Confirmación de registro
app/auth/error/page.tsx        - Página de error
app/auth/callback/route.ts     - Callback de Supabase
```

## 👤 Panel del Cliente

```
app/client/layout.tsx          - Layout protegido del cliente
app/client/dashboard/page.tsx  - Dashboard principal del cliente
app/client/new-ticket/page.tsx - Crear nuevo ticket
app/client/payment/[ticketId]/page.tsx - Página de pago
```

## 🔧 Panel del Técnico

```
app/technician/layout.tsx      - Layout protegido del técnico
app/technician/dashboard/page.tsx - Dashboard del técnico
app/technician/tickets/page.tsx    - Gestionar tickets asignados
```

## 🛠️ Panel del Administrador

```
app/admin/layout.tsx           - Layout protegido del admin
app/admin/dashboard/page.tsx   - Dashboard del administrador
app/admin/tickets/page.tsx     - Gestionar todos los tickets
app/admin/equipment/page.tsx   - CRUD de equipos
app/admin/users/page.tsx       - Gestionar usuarios y roles
```

## 💳 Pagos

```
app/api/create-payment/route.ts - API para crear pagos con Stripe
lib/stripe.ts                  - Configuración de Stripe
```

## 🛠️ Utilidades

```
lib/ticket-utils.ts            - Funciones útiles para tickets
lib/utils.ts                   - Utilidades generales
tailwind.config.ts             - Configuración de Tailwind
tsconfig.json                  - Configuración de TypeScript
```

## 📝 Documentación Detallada

```
README.md                      - Documentación principal del proyecto
PROJECT_SUMMARY.md             - Resumen detallado del sistema
SYSTEM_GUIDE.md               - Guía del sistema (flujos, endpoints)
CHECKLIST.md                  - Lista de tareas completadas
SETUP.md                      - Instrucciones de setup completas
QUICKSTART.md                 - Guía rápida alternativa
FILE_INDEX.md                 - Este archivo
```

## 📦 Configuración del Proyecto

```
package.json                   - Dependencias y scripts
next.config.mjs               - Configuración de Next.js
app/layout.tsx                - Layout global
app/globals.css               - Estilos globales
components/theme-provider.tsx - Proveedor de tema
components/ui/*               - Componentes shadcn/ui
hooks/use-mobile.tsx          - Hook para detectar mobile
hooks/use-toast.ts            - Hook para notificaciones
```

## 🎯 Orden de Lectura Recomendado

1. **QUICK_START.md** - Comienza aquí (5 minutos)
2. **MIGRATION_COMPLETE.sql** - Ejecuta esto en Supabase
3. **ADMIN_SETUP.md** - Crea el usuario admin
4. **README.md** - Documentación general
5. **PROJECT_SUMMARY.md** - Entender la arquitectura
6. Luego revisa las páginas según lo que quieras cambiar

## 🔍 Buscar por Función

### Quiero agregar más equipos
→ Edita `MIGRATION_COMPLETE.sql` (línea ~140)

### Quiero cambiar los estados de tickets
→ Busca en `lib/ticket-utils.ts` y actualiza enums

### Quiero modificar el dashboard del admin
→ Edita `app/admin/dashboard/page.tsx`

### Quiero cambiar el flujo de pagos
→ Ve a `app/client/payment/[ticketId]/page.tsx`

### Quiero modificar la RLS (seguridad)
→ Busca "CREATE POLICY" en `MIGRATION_COMPLETE.sql`

### Quiero agregar nuevos campos a tickets
→ Modifica la tabla en `MIGRATION_COMPLETE.sql`

## ✅ Checklist de Instalación

- [ ] Leer `QUICK_START.md`
- [ ] Ejecutar `MIGRATION_COMPLETE.sql` en Supabase
- [ ] Crear usuario admin en Authentication
- [ ] Ejecutar `CREATE_ADMIN_USER.sql`
- [ ] Copiar `.env.example` a `.env.local`
- [ ] Agregar credenciales de Supabase
- [ ] Agregar credenciales de Stripe (si usas pagos)
- [ ] Probar login como admin
- [ ] Crear usuario técnico
- [ ] Crear usuario cliente
- [ ] Crear un ticket de prueba
