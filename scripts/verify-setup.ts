/**
 * Script de Verificación del Setup
 * 
 * Ejecuta este script para verificar que todo está configurado correctamente:
 * npx ts-node scripts/verify-setup.ts
 */

const checks = {
  env: false,
  supabase: false,
  stripe: false,
  database: false,
}

function checkEnvironment() {
  console.log('\n✓ Verificando variables de entorno...')
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const optional = [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
  ]

  let passed = true

  for (const env of required) {
    if (!process.env[env]) {
      console.log(`  ✗ ${env} - NO ENCONTRADO`)
      passed = false
    } else {
      console.log(`  ✓ ${env} - OK`)
    }
  }

  for (const env of optional) {
    if (process.env[env]) {
      console.log(`  ✓ ${env} - OK`)
    } else {
      console.log(`  ⚠ ${env} - NO CONFIGURADO (opcional)`)
    }
  }

  checks.env = passed
  return passed
}

function checkFiles() {
  console.log('\n✓ Verificando archivos del proyecto...')
  
  const files = [
    'app/page.tsx',
    'app/layout.tsx',
    'app/auth/login/page.tsx',
    'app/auth/register/page.tsx',
    'app/client/dashboard/page.tsx',
    'app/admin/dashboard/page.tsx',
    'app/technician/dashboard/page.tsx',
    'lib/supabase/client.ts',
    'middleware.ts',
  ]

  let passed = true
  const fs = require('fs')
  const path = require('path')

  for (const file of files) {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ ${file} - ENCONTRADO`)
    } else {
      console.log(`  ✗ ${file} - NO ENCONTRADO`)
      passed = false
    }
  }

  return passed
}

async function checkSupabase() {
  console.log('\n✓ Verificando conexión a Supabase...')
  
  try {
    const { createClient } = require('@supabase/supabase-js')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.log('  ⚠ Variables de Supabase no configuradas')
      return false
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Intentar obtener una tabla
    const { data, error } = await supabase
      .from('equipment')
      .select('count(*)', { count: 'exact', head: true })

    if (error) {
      console.log(`  ✗ Error al conectar: ${error.message}`)
      return false
    }

    console.log('  ✓ Conexión a Supabase - OK')
    checks.supabase = true
    return true
  } catch (error: any) {
    console.log(`  ✗ Error: ${error.message}`)
    return false
  }
}

async function checkDatabase() {
  console.log('\n✓ Verificando tablas de la base de datos...')
  
  try {
    const { createClient } = require('@supabase/supabase-js')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.log('  ⚠ No se puede verificar sin credenciales')
      return false
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const tables = [
      'user_profiles',
      'equipment',
      'tickets',
      'ticket_status_history',
      'payments',
    ]

    let passed = true
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('count(*)', { count: 'exact', head: true })

      if (error) {
        console.log(`  ✗ ${table} - NO ENCONTRADO`)
        passed = false
      } else {
        console.log(`  ✓ ${table} - OK`)
      }
    }

    checks.database = passed
    return passed
  } catch (error: any) {
    console.log(`  ✗ Error: ${error.message}`)
    return false
  }
}

function checkStripe() {
  console.log('\n✓ Verificando configuración de Stripe...')
  
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!publishableKey || !secretKey) {
    console.log('  ⚠ Stripe no configurado (opcional)')
    return true
  }

  if (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) {
    console.log('  ✓ Stripe Publishable Key - OK')
  } else {
    console.log('  ✗ Stripe Publishable Key - INVÁLIDA')
    return false
  }

  if (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_')) {
    console.log('  ✓ Stripe Secret Key - OK')
  } else {
    console.log('  ✗ Stripe Secret Key - INVÁLIDA')
    return false
  }

  checks.stripe = true
  return true
}

async function runAllChecks() {
  console.log('╔════════════════════════════════════════════════════════╗')
  console.log('║         VERIFICACIÓN DE SETUP - COOL TICKETS           ║')
  console.log('╚════════════════════════════════════════════════════════╝')

  checkEnvironment()
  checkFiles()
  await checkSupabase()
  await checkDatabase()
  checkStripe()

  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║                      RESUMEN                            ║')
  console.log('╚════════════════════════════════════════════════════════╝')

  console.log(`Environment: ${checks.env ? '✓ OK' : '✗ ERROR'}`)
  console.log(`Supabase: ${checks.supabase ? '✓ OK' : '⚠ PENDIENTE'}`)
  console.log(`Database: ${checks.database ? '✓ OK' : '⚠ PENDIENTE'}`)
  console.log(`Stripe: ${checks.stripe ? '✓ OK' : '⚠ OPCIONAL'}`)

  const allPassed = checks.env && checks.supabase && checks.database
  
  if (allPassed) {
    console.log('\n✓ ¡Todo está configurado correctamente!')
    console.log('  Ahora puedes ejecutar: npm run dev')
  } else {
    console.log('\n✗ Hay errores en la configuración')
    console.log('  Revisa QUICK_START.md para más información')
  }

  process.exit(allPassed ? 0 : 1)
}

runAllChecks().catch((error) => {
  console.error('Error fatal:', error)
  process.exit(1)
})
