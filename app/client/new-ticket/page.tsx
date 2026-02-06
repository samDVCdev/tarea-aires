'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Equipment {
  id: string
  brand: string
  model: string
  type: string
}

export default function NewTicketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [equipmentLoading, setEquipmentLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    equipment_id: '',
    description: '',
  })

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const supabase = createClient()
        const { data, error: equipmentError } = await supabase
          .from('equipment')
          .select('*')
          .eq('is_active', true)
          .order('brand', { ascending: true })

        if (equipmentError) {
          console.error('Error fetching equipment:', equipmentError)
        } else {
          setEquipment(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setEquipmentLoading(false)
      }
    }

    fetchEquipment()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('No estás autenticado')
        return
      }

      if (!formData.equipment_id) {
        setError('Selecciona un equipo')
        return
      }

      if (!formData.description.trim()) {
        setError('Describe el problema')
        return
      }

      const { data, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            client_id: user.id,
            equipment_id: formData.equipment_id,
            description: formData.description,
            status: 'en_espera',
          },
        ])
        .select()

      if (ticketError) {
        setError(ticketError.message)
        return
      }

      if (data && data.length > 0) {
        // Create initial status history entry
        await supabase.from('ticket_status_history').insert([
          {
            ticket_id: data[0].id,
            new_status: 'en_espera',
            reason: 'Ticket creado',
          },
        ])

        setSuccess(true)
        toast.success('Ticket creado exitosamente')

        setTimeout(() => {
          router.push('/client/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Crear Nuevo Ticket</h1>
        <p className="text-slate-600">Describe el problema con tu aire acondicionado</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitud de Reparación</CardTitle>
          <CardDescription>Completa el formulario para crear un nuevo ticket</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">
                Ticket creado exitosamente. Redirigiendo...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="equipment">Equipo de Aire Acondicionado</Label>
              <Select value={formData.equipment_id} onValueChange={(value) => setFormData({ ...formData, equipment_id: value })}>
                <SelectTrigger disabled={equipmentLoading || loading}>
                  <SelectValue placeholder="Selecciona un equipo" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.brand} - {eq.model} ({eq.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {equipment.length === 0 && !equipmentLoading && (
                <p className="text-xs text-slate-500 mt-2">
                  No hay equipos disponibles. Contacta al administrador.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción del Problema</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe con detalle el problema que tiene tu aire acondicionado..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-2">Sé lo más detallado posible para ayudar al técnico</p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1" disabled={loading}>
                {loading ? 'Creando ticket...' : 'Crear Ticket'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
