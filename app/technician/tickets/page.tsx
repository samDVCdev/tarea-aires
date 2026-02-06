'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Edit2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Ticket {
  id: string
  client_id: string
  description: string
  status: string
  budget: number | null
  actual_cost: number | null
  created_at: string
  updated_at: string
}

export default function TechnicianTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [reason, setReason] = useState('')
  const [budget, setBudget] = useState('')
  const [actualCost, setActualCost] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('assigned_to', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error fetching tickets:', error)
          } else {
            setTickets(data || [])
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleOpenModal = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setNewStatus(ticket.status)
    setBudget(ticket.budget?.toString() || '')
    setActualCost(ticket.actual_cost?.toString() || '')
    setReason('')
    setShowUpdateModal(true)
  }

  const handleUpdateTicket = async () => {
    if (!selectedTicket || !newStatus) {
      toast.error('Selecciona un estado')
      return
    }

    setUpdatingTicketId(selectedTicket.id)

    try {
      const supabase = createClient()

      // Update ticket
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      if (budget) updateData.budget = parseFloat(budget)
      if (actualCost) updateData.actual_cost = parseFloat(actualCost)

      const { error: updateError } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', selectedTicket.id)

      if (updateError) {
        toast.error(updateError.message)
        return
      }

      // Create status history entry
      await supabase.from('ticket_status_history').insert([
        {
          ticket_id: selectedTicket.id,
          old_status: selectedTicket.status,
          new_status: newStatus,
          reason: reason || undefined,
        },
      ])

      // Update local state
      const updatedTickets = tickets.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: newStatus,
              budget: budget ? parseFloat(budget) : t.budget,
              actual_cost: actualCost ? parseFloat(actualCost) : t.actual_cost,
            }
          : t
      )
      setTickets(updatedTickets)

      toast.success('Ticket actualizado correctamente')
      setShowUpdateModal(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar el ticket')
    } finally {
      setUpdatingTicketId(null)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      en_espera: 'bg-yellow-100 text-yellow-800',
      asignado: 'bg-blue-100 text-blue-800',
      diagnostico: 'bg-purple-100 text-purple-800',
      aprobado: 'bg-orange-100 text-orange-800',
      reparado: 'bg-green-100 text-green-800',
      finalizado: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-slate-100 text-slate-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      en_espera: 'En Espera',
      asignado: 'Asignado',
      diagnostico: 'Diagnóstico',
      aprobado: 'Aprobado',
      reparado: 'Reparado',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
    }
    return labels[status] || status
  }

  const filteredTickets =
    filterStatus === 'all' ? tickets : tickets.filter((t) => t.status === filterStatus)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Mis Tickets Asignados</h1>
        <p className="text-slate-600">Actualiza el estado y progreso de tus reparaciones</p>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="asignado">Asignado</SelectItem>
              <SelectItem value="diagnostico">Diagnóstico</SelectItem>
              <SelectItem value="aprobado">Aprobado</SelectItem>
              <SelectItem value="reparado">Reparado</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tickets</CardTitle>
          <CardDescription>Total: {filteredTickets.length} tickets</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Cargando tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">No hay tickets con este filtro</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>Costo Real</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">{ticket.id.slice(0, 8)}...</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.description}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusLabel(ticket.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {ticket.budget ? `$${ticket.budget.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ticket.actual_cost ? `$${ticket.actual_cost.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(ticket.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(ticket)}
                          className="gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Actualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar Estado del Ticket</DialogTitle>
            <DialogDescription>
              Cambiar estado y proporcionar información adicional
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Descripción:</strong> {selectedTicket?.description}
              </p>
            </div>

            <div>
              <Label htmlFor="status">Nuevo Estado</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asignado">Asignado</SelectItem>
                  <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="reparado">Reparado</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Presupuesto ($)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="actualCost">Costo Real ($)</Label>
              <Input
                id="actualCost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="reason">Razón del Cambio</Label>
              <Textarea
                id="reason"
                placeholder="Describe por qué cambias el estado..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdateTicket}
              disabled={updatingTicketId === selectedTicket?.id}
            >
              {updatingTicketId === selectedTicket?.id ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
