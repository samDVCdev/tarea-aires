'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface Ticket {
  id: string
  description: string
  status: string
  budget: number | null
  actual_cost: number | null
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.ticketId as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', ticketId)
          .single()

        if (fetchError) {
          setError('No se encontró el ticket')
          return
        }

        if (data) {
          setTicket(data)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Error al cargar el ticket')
      } finally {
        setLoading(false)
      }
    }

    if (ticketId) {
      fetchTicket()
    }
  }, [ticketId])

  const handlePayment = async () => {
    if (!ticket) return

    setProcessing(true)
    setError(null)

    try {
      const amount = ticket.actual_cost || ticket.budget || 0

      if (amount <= 0) {
        setError('No hay monto para pagar')
        setProcessing(false)
        return
      }

      // Create payment intent
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId,
          amount,
          description: `Pago de reparación - ${ticket.description.substring(0, 50)}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear el pago')
      }

      const { clientSecret } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe no cargó correctamente')
      }

      const result = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pago'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-slate-600">Cargando...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Ticket no encontrado'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const paymentAmount = ticket.actual_cost || ticket.budget || 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Pagar Reparación</h1>
        <p className="text-slate-600">Completa el pago de tu reparación</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumen del Ticket</CardTitle>
          <CardDescription>Detalles de la reparación a pagar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-2">Descripción</p>
            <p className="text-sm text-slate-900 font-medium">{ticket.description}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600 mb-2">Estado</p>
            <p className="text-sm text-slate-900 font-medium capitalize">{ticket.status}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            {ticket.budget && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Presupuesto:</span>
                <span className="text-sm font-medium">${ticket.budget.toFixed(2)}</span>
              </div>
            )}
            {ticket.actual_cost && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Costo Real:</span>
                <span className="text-sm font-medium">${ticket.actual_cost.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold">Total a Pagar:</span>
              <span className="font-bold text-lg text-blue-600">${paymentAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
          <CardDescription>Usa Stripe para realizar el pago de forma segura</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              El pago será procesado de forma segura por Stripe. Se te redireccionará a su página de checkout.
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={processing || paymentAmount <= 0}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
          >
            {processing ? 'Procesando...' : `Pagar $${paymentAmount.toFixed(2)}`}
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full mt-3"
            disabled={processing}
          >
            Cancelar
          </Button>
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Este es un sistema de demostración. Para usar Stripe en producción, necesitarás una cuenta de Stripe configurada correctamente.
        </AlertDescription>
      </Alert>
    </div>
  )
}
