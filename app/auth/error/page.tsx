import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, XCircle } from 'lucide-react'

export default function ErrorPage() {
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
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <CardTitle>Error de Autenticación</CardTitle>
            <CardDescription>Hubo un problema al procesar tu solicitud</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                El enlace de confirmación puede haber expirado o ser inválido. Por favor, intenta
                registrarte nuevamente.
              </p>
            </div>

            <div className="space-y-2">
              <Link href="/auth/register" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Volver al Registro
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Ir al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
