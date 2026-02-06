import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">CoolTickets</h1>
          </div>
          <p className="text-slate-600">Gestión de tickets de aire acondicionado</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle>¡Cuenta Creada!</CardTitle>
            <CardDescription>Tu registro ha sido exitoso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                Hemos enviado un email de confirmación a tu correo. Por favor, verifica tu email
                para completar el proceso de registro.
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>Una vez confirmado tu email podrás:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Solicitar reparaciones</li>
                <li>Monitorear el estado de tus tickets</li>
                <li>Realizar pagos</li>
              </ul>
            </div>

            <Link href="/auth/login" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Ir al Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
