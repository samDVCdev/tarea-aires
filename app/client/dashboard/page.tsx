'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Clock, CheckCircle2, AlertCircle, Eye, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface Ticket {
  id: string
  description: string
  status: string
  created_at: string
  updated_at: string
  budget: number | null
  actual_cost: number | null
  equipment_id: string
}

interface StatusHistory {
  id: string
  old_status: string
  new_status: string
  created_at: string
  reason: string
}

export default function ClientDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [ticketHistory, setTicketHistory] = useState<StatusHistory[]>([])
  const [showHistoryModal, setShowHistoryModal] = useState(false)

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
            .eq('client_id', user.id)
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

  const handleViewDetails = async (ticket: Ticket) => {
    setSelectedTicket(ticket)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('ticket_status_history')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true })

      if (!error) {
        setTicketHistory(data || [])
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }

    setShowHistoryModal(true)
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Mis Tickets</h1>
          <p className="text-slate-600">Gestiona tus solicitudes de reparación</p>
        </div>
        <Link href="/client/new-ticket">
          <Button className="bg-blue-600 hover:bg-blue-700">Nuevo Ticket</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{tickets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">En Espera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tickets.filter((t) => t.status === 'en_espera').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">En Proceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tickets.filter((t) => ['asignado', 'diagnostico', 'reparado'].includes(t.status)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Finalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter((t) => t.status === 'finalizado').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tickets</CardTitle>
          <CardDescription>Todos tus tickets de reparación</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Cargando tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">No tienes tickets creados</p>
              <Link href="/client/new-ticket" className="mt-4 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700">Crear Primer Ticket</Button>
              </Link>
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
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">{ticket.id.slice(0, 8)}...</TableCell>
                      <TableCell className="max-w-xs truncate">{ticket.description}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusLabel(ticket.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.budget ? `$${ticket.budget.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(ticket.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(ticket)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Button>
                        {(ticket.status === 'aprobado' || ticket.status === 'reparado' || ticket.status === 'finalizado') &&
                          (ticket.budget || ticket.actual_cost) && (
                            <Link href={`/client/payment/${ticket.id}`}>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 gap-1"
                              >
                                <CreditCard className="w-4 h-4" />
                                Pagar
                              </Button>
                            </Link>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Ticket</DialogTitle>
            <DialogDescription>ID: {selectedTicket?.id.slice(0, 8)}...</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Estado Actual</p>
                <Badge className={`mt-1 ${getStatusColor(selectedTicket?.status || '')}`}>
                  {getStatusLabel(selectedTicket?.status || '')}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-slate-600">Presupuesto</p>
                <p className="font-semibold">
                  {selectedTicket?.budget ? `$${selectedTicket.budget.toFixed(2)}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Costo Real</p>
                <p className="font-semibold">
                  {selectedTicket?.actual_cost ? `$${selectedTicket.actual_cost.toFixed(2)}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Fecha de Creación</p>
                <p className="font-semibold">
                  {selectedTicket?.created_at && new Date(selectedTicket.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">Descripción</p>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                {selectedTicket?.description}
              </p>
            </div>

            {/* History Timeline */}
            {ticketHistory.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-3">Historial de Cambios</p>
                <div className="space-y-3">
                  {ticketHistory.map((entry) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {getStatusLabel(entry.old_status || '')} →{' '}
                          {getStatusLabel(entry.new_status)}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(entry.created_at).toLocaleString('es-ES')}
                        </p>
                        {entry.reason && (
                          <p className="text-xs text-slate-600 mt-1 italic">{entry.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
