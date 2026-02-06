# Guía Rápida - Comenzar en 5 Minutos

## ⚡ Paso 1: Ejecutar Migraciones (2 minutos)

1. Abre tu proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** → **New Query**
3. Abre el archivo `MIGRATION_COMPLETE.sql` de este proyecto
4. Copia TODO el contenido
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en **Run** (botón verde)
7. ✅ Espera a que complete (verás "Success")

**Resultado**: Se crearán todas las tablas, índices, RLS y datos de equipos.

---

## ⚡ Paso 2: Crear Usuario Admin (2 minutos)

### Opción A: Rápida (Recomendada)

1. En Supabase, ve a **Authentication** → **Users**
2. Haz clic en **Add user** (botón verde)
3. Llenar así:
   - **Email**: `admin@cooltickets.com`
   - **Password**: `AdminSecure123!@#`
   - **Confirm Password**: `AdminSecure123!@#`
4. Haz clic en **Save user**
5. Vuelve a **SQL Editor** → **New Query**
6. Copia y ejecuta:

```sql
UPDATE public.user_profiles 
SET role = 'administrador', full_name = 'Administrador'
WHERE email = 'admin@cooltickets.com';
```

7. ✅ Verifica que el role sea "administrador"

### Opción B: Automática (Si sabes SQL)

1. Abre `CREATE_ADMIN_USER.sql`
2. Sigue las instrucciones en el archivo

---

## ⚡ Paso 3: Ingresar al Sistema (1 minuto)

1. Abre tu app: `http://localhost:3000`
2. Haz clic en **Ingreso** (arriba a la derecha)
3. Usa estas credenciales:
   - **Email**: `admin@cooltickets.com`
   - **Password**: `AdminSecure123!@#`
4. ✅ ¡Deberías ver el Dashboard del Administrador!

---

## 📋 Checklist Completo

- [ ] Ejecuté `MIGRATION_COMPLETE.sql` en Supabase
- [ ] Creé usuario admin en Authentication
- [ ] Ejecuté `UPDATE public.user_profiles` para asignar rol admin
- [ ] Ingresé al sistema con admin@cooltickets.com
- [ ] Veo el Dashboard del Administrador

---

## 🔧 Crear Más Usuarios (Técnicos, Clientes)

### Crear Técnico

1. **Authentication** → **Add user**
   - Email: `tecnico1@cooltickets.com`
   - Password: `Tecnico123!@#`

2. **SQL Editor** → **New Query**:
```sql
UPDATE public.user_profiles 
SET role = 'tecnico', full_name = 'Juan García'
WHERE email = 'tecnico1@cooltickets.com';
```

### Crear Cliente

1. **Authentication** → **Add user**
   - Email: `cliente@cooltickets.com`
   - Password: `Cliente123!@#`

2. El rol será `cliente` automáticamente (es el default)

---

## 🧪 Datos de Prueba

Ya están creados 5 equipos:
- Aire Acondicionado 1 Tonelada (Samsung)
- Aire Acondicionado 1.5 Toneladas (LG)
- Aire Acondicionado 2 Toneladas (Carrier)
- Aire Acondicionado 2.5 Toneladas (Panasonic)
- Aire Acondicionado 3 Toneladas (Midea)

---

## ⚠️ Si Algo No Funciona

### Error: "Las tablas no existen"
→ Ejecuta `MIGRATION_COMPLETE.sql` completo en SQL Editor

### Error: "No puedo ingresar como admin"
→ Verifica que el `role` sea `administrador`:
```sql
SELECT email, role FROM public.user_profiles WHERE email = 'admin@cooltickets.com';
```

### Error: "Módulo no encontrado"
→ Recarga la página del navegador (Ctrl+F5 o Cmd+Shift+R)

### Error: "Email ya existe"
→ Usa otro email o borra el usuario en Authentication primero

---

## 📞 Resumen de Credenciales

```
ADMIN
Email: admin@cooltickets.com
Password: AdminSecure123!@#

TÉCNICO (para pruebas)
Email: tecnico1@cooltickets.com
Password: Tecnico123!@#

CLIENTE (para pruebas)
Email: cliente@cooltickets.com
Password: Cliente123!@#
```

---

## ✅ ¡Listo!

Tu sistema está completamente funcional. Ahora puedes:
- Crear tickets como cliente
- Asignar tickets como admin
- Actualizar estados como técnico
- Procesar pagos con Stripe
