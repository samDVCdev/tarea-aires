import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Clock, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">CoolTickets</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="outline">Ingreso</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Registrarse</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">
          Gestión de Tickets de Aire Acondicionado
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Solicita reparaciones, asigna técnicos y realiza seguimiento de tus equipos de aire
          acondicionado en un solo lugar.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Solicitar Reparación
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">
              Ver Mis Tickets
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Características Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cliente Card */}
            <Card>
              <CardHeader>
                <AlertCircle className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Para Clientes</CardTitle>
                <CardDescription>Gestiona tus solicitudes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Solicita reparaciones</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Monitorea estado</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Visualiza historial</p>
                </div>
              </CardContent>
            </Card>

            {/* Técnico Card */}
            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle>Para Técnicos</CardTitle>
                <CardDescription>Administra asignaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Recibe asignaciones</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Actualiza estado</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Proporciona diagnósticos</p>
                </div>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Para Administradores</CardTitle>
                <CardDescription>Controla el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Asigna tickets</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Gestiona inventario</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">Reportes y estadísticas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Cómo Funciona
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Solicita', desc: 'Registra tu problema' },
            { step: '2', title: 'Asigna', desc: 'Admin designa técnico' },
            { step: '3', title: 'Repara', desc: 'Técnico trabaja en ello' },
            { step: '4', title: 'Paga', desc: 'Realiza el pago' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                {item.step}
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h3>
          <p className="text-lg text-blue-100 mb-8">
            Registrate ahora y solicita tu primera reparación
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              Registrarse Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 CoolTickets. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
