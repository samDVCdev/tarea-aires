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
  assigned_to: string | null
  budget: number | null
  created_at: string
  updated_at: string
}

interface Technician {
  id: string
  full_name: string
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [assignmentLoading, setAssignmentLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Fetch all tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false })

        if (ticketsError) {
          console.error('Error fetching tickets:', ticketsError)
        } else {
          setTickets(ticketsData || [])
        }

        // Fetch technicians
        const { data: techData, error: techError } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('role', 'tecnico')

        if (techError) {
          console.error('Error fetching technicians:', techError)
        } else {
          setTechnicians(techData || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedTechnician) {
      toast.error('Selecciona un técnico')
      return
    }

    setAssignmentLoading(true)
    try {
      const supabase = createClient()

      // Update ticket with technician assignment
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          assigned_to: selectedTechnician,
          status: 'asignado',
          updated_at: new Date().toISOString(),
        })
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
          new_status: 'asignado',
          reason: `Asignado a técnico`,
        },
      ])

      // Update local state
      const updatedTickets = tickets.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, assigned_to: selectedTechnician, status: 'asignado' }
          : t
      )
      setTickets(updatedTickets)

      toast.success('Ticket asignado correctamente')
      setShowAssignModal(false)
      setSelectedTechnician('')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al asignar el ticket')
    } finally {
      setAssignmentLoading(false)
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
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestión de Tickets</h1>
        <p className="text-slate-600">Asigna, revisa y gestiona todos los tickets del sistema</p>
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
              <SelectItem value="en_espera">En Espera</SelectItem>
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
                    <TableHead>Técnico</TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
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
                        {ticket.assigned_to ? 'Asignado' : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ticket.budget ? `$${ticket.budget.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(ticket.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setShowAssignModal(true)
                          }}
                          className="gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Asignar
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

      {/* Assign Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Ticket a Técnico</DialogTitle>
            <DialogDescription>
              Selecciona un técnico para asignar el ticket
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Descripción:</strong> {selectedTicket?.description}
              </p>
            </div>

            <div>
              <Label htmlFor="technician">Técnico</Label>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un técnico" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAssignTicket}
              disabled={assignmentLoading}
            >
              {assignmentLoading ? 'Asignando...' : 'Asignar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
