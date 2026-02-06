'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertCircle, Clock, CheckCircle2, Wrench } from 'lucide-react'

export default function TechnicianDashboard() {
  const [userEmail, setUserEmail] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [recentTickets, setRecentTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUserEmail(user.email || '')

          // Fetch assigned tickets
          const { data: ticketsData } = await supabase
            .from('tickets')
            .select('*')
            .eq('assigned_to', user.id)

          if (ticketsData) {
            setStats({
              total: ticketsData.length,
              pending: ticketsData.filter((t) => t.status === 'asignado').length,
              inProgress: ticketsData.filter((t) =>
                ['diagnostico', 'reparado'].includes(t.status)
              ).length,
              completed: ticketsData.filter((t) =>
                ['finalizado', 'aprobado'].includes(t.status)
              ).length,
            })

            // Prepare chart data
            const statusCount: Record<string, number> = {}
            ticketsData.forEach((t: any) => {
              statusCount[t.status] = (statusCount[t.status] || 0) + 1
            })

            const data = Object.entries(statusCount).map(([status, count]) => ({
              status: getStatusLabel(status),
              count,
            }))
            setChartData(data)

            // Get recent tickets
            const recent = ticketsData.slice(0, 5)
            setRecentTickets(recent)
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Mi Dashboard</h1>
        <p className="text-slate-600">Resumen de tus tickets asignados - {userEmail}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Total Asignados</CardTitle>
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs text-slate-600 mt-1">Tickets asignados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Pendientes</CardTitle>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.pending}</div>
            <p className="text-xs text-slate-600 mt-1">Por iniciar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">En Proceso</CardTitle>
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.inProgress}</div>
            <p className="text-xs text-slate-600 mt-1">Trabajando en ello</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Completados</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.completed}</div>
            <p className="text-xs text-slate-600 mt-1">Finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Tickets por Estado</CardTitle>
          <CardDescription>Tus tickets asignados según su estado</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-80 flex items-center justify-center text-slate-600">
              Cargando...
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-600">
              No hay datos disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets Recientes Asignados</CardTitle>
          <CardDescription>Tus últimos 5 tickets</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Cargando...</div>
          ) : recentTickets.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              No tienes tickets asignados
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {ticket.description.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(ticket.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
