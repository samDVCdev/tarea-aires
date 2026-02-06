# Guía de Instalación Paso a Paso

## 🎯 Objetivo
Dejar tu sistema completamente funcional en 15 minutos.

---

## PASO 1: Preparar Supabase (3 minutos)

### 1.1 Abre Supabase
- Ve a [supabase.com](https://supabase.com)
- Ingresa a tu proyecto
- Deberías ver algo como esto:
  ```
  Project: cool-tickets-xyz
  ```

### 1.2 Abre SQL Editor
- En el menú izquierdo, haz clic en **SQL Editor**
- Luego haz clic en **New Query**

---

## PASO 2: Crear Tablas y Datos (2 minutos)

### 2.1 Copia el Script
- Abre el archivo `MIGRATION_COMPLETE.sql` en tu proyecto
- Selecciona TODO el contenido (Ctrl+A)
- Cópialo (Ctrl+C)

### 2.2 Pégalo en Supabase
- Vuelve a la pestaña de Supabase
- En el **SQL Editor**, pega el código (Ctrl+V)
- Deberías ver una ventana con mucho código SQL

### 2.3 Ejecuta el Script
- Haz clic en el botón **Run** (verde, con un triángulo ▶)
- Espera a que termine
- Deberías ver en verde: **"Success"**

✅ **Si ves éxito**, continúa al Paso 3.
❌ **Si hay error**, revisa que copiaste todo el archivo.

---

## PASO 3: Crear Usuario Admin (3 minutos)

### 3.1 Ve a Authentication
- En Supabase, en el menú izquierdo, haz clic en **Authentication**
- Luego haz clic en **Users**

### 3.2 Agregar Usuario
- Haz clic en el botón **Add user** (verde, arriba a la derecha)
- Se abrirá un formulario

### 3.3 Llenar Datos
Escribe exactamente esto:

| Campo | Valor |
|-------|-------|
| Email | `admin@cooltickets.com` |
| Password | `AdminSecure123!@#` |
| Confirm Password | `AdminSecure123!@#` |

- Haz clic en **Save user**
- Deberías ver un mensaje: "User created"

✅ **Si ves el mensaje**, el usuario fue creado. Continúa.

### 3.4 Asignar Rol Admin
- Vuelve a **SQL Editor** → **New Query**
- Copia este código:

```sql
UPDATE public.user_profiles 
SET role = 'administrador'
WHERE email = 'admin@cooltickets.com';
```

- Pégalo y haz clic en **Run**
- Deberías ver: **"Success"** o **"1 row affected"**

✅ Ahora el usuario es admin.

---

## PASO 4: Configurar Variables de Entorno (2 minutos)

### 4.1 Obtener Claves de Supabase
1. En Supabase, ve a **Settings** → **API**
2. Copia el valor de **Project URL** (algo como `https://xxxxx.supabase.co`)
3. Copia el valor de **anon public** (empieza con `eyJhbG...`)

### 4.2 Crear archivo .env.local
1. En tu proyecto, abre el archivo `.env.example`
2. Cópialo completo
3. Crea un archivo nuevo llamado `.env.local`
4. Pega el contenido
5. Reemplaza los valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co     (el URL de arriba)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...                (la anon key)
```

### 4.3 Stripe (Opcional por ahora)
Puedes dejar las claves de Stripe como están. Las necesitarás después si quieres usar pagos.

✅ Archivo `.env.local` creado y configurado.

---

## PASO 5: Iniciar la Aplicación (1 minuto)

### 5.1 Abre Terminal
En la carpeta del proyecto, abre una terminal:

```bash
npm run dev
```

### 5.2 Espera a que Compile
Deberías ver algo como:
```
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

✅ La app está corriendo en `http://localhost:3000`

---

## PASO 6: Prueba el Sistema (4 minutos)

### 6.1 Abre la App
- En el navegador, ve a `http://localhost:3000`
- Deberías ver la página principal con el logo "CoolTickets"

### 6.2 Ingresa como Admin
- Haz clic en **Ingreso** (arriba a la derecha)
- Usa estas credenciales:
  - Email: `admin@cooltickets.com`
  - Password: `AdminSecure123!@#`
- Haz clic en **Ingresar**

✅ **Si ves el Dashboard del Admin**, ¡funcionó! 🎉

---

## ❌ Solucionar Problemas

### "Las tablas no existen"
**Problema**: Ves un error como "table 'equipment' does not exist"
**Solución**: 
- Ve a Supabase → SQL Editor
- Verifica que ejecutaste `MIGRATION_COMPLETE.sql`
- Si no, ejecútalo ahora

### "Email o password incorrecto"
**Problema**: No puedo ingresar como admin
**Solución**:
- Verifica que creaste el usuario en Authentication > Users
- Verifica que ejecutaste el SQL para asignar el rol admin
- Prueba con email: `admin@cooltickets.com` (sin espacios)

### "Error: Módulo no encontrado"
**Problema**: Error en consola del navegador
**Solución**:
- Presiona Ctrl+F5 (o Cmd+Shift+R en Mac) para limpiar caché
- Si persiste, reinicia con `npm run dev`

### ".env.local no funciona"
**Problema**: Las variables de entorno no se cargan
**Solución**:
- Verifica que el archivo se llama `.env.local` (con el punto al inicio)
- Reinicia la app después de crear el archivo
- Verifica que el contenido no tiene caracteres raros

---

## ✅ Checklist Final

- [ ] Ejecuté `MIGRATION_COMPLETE.sql` en Supabase
- [ ] Creé usuario admin@cooltickets.com en Authentication
- [ ] Ejecuté el SQL para asignar rol admin
- [ ] Creé archivo `.env.local` con credenciales
- [ ] Inicié la app con `npm run dev`
- [ ] Ingresé como admin exitosamente
- [ ] Veo el Dashboard del Administrador

Si todos los pasos están marcados, ¡tu sistema está completamente funcional!

---

## 🚀 Próximos Pasos (Opcional)

### Crear Usuario Técnico
1. Authentication > Add user
   - Email: `tecnico1@cooltickets.com`
   - Password: `Tecnico123!@#`
2. SQL Editor ejecuta:
```sql
UPDATE public.user_profiles 
SET role = 'tecnico', full_name = 'Juan García'
WHERE email = 'tecnico1@cooltickets.com';
```

### Crear Usuario Cliente
1. Authentication > Add user
   - Email: `cliente@cooltickets.com`
   - Password: `Cliente123!@#`
2. El rol se asigna automáticamente como 'cliente'

### Probar Flujo Completo
1. Ingresa como cliente
2. Haz clic en "Nuevo Ticket"
3. Completa el formulario
4. Ingresa como admin
5. Asigna el ticket a un técnico
6. Ingresa como técnico
7. Actualiza el estado del ticket

---

## 📞 Credenciales de Prueba

```
ADMIN
├─ Email: admin@cooltickets.com
└─ Password: AdminSecure123!@#

TÉCNICO
├─ Email: tecnico1@cooltickets.com
└─ Password: Tecnico123!@#

CLIENTE
├─ Email: cliente@cooltickets.com
└─ Password: Cliente123!@#
```

---

## ✨ ¡Listo!

Tu sistema de gestión de tickets de aire acondicionado está completamente funcional.
