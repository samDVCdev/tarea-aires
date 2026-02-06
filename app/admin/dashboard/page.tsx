'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertCircle, Clock, CheckCircle2, Users, Wrench } from 'lucide-react'

interface TicketStats {
  status: string
  count: number
}

interface UserStats {
  role: string
  count: number
}

export default function AdminDashboard() {
  const [ticketStats, setTicketStats] = useState<TicketStats[]>([])
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [totalTickets, setTotalTickets] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalEquipment, setTotalEquipment] = useState(0)
  const [recentTickets, setRecentTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()

        // Fetch ticket stats
        const { data: ticketsData } = await supabase.from('tickets').select('status')
        const statusCount: Record<string, number> = {}
        ticketsData?.forEach((t: any) => {
          statusCount[t.status] = (statusCount[t.status] || 0) + 1
        })
        const stats = Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
        }))
        setTicketStats(stats)
        setTotalTickets(ticketsData?.length || 0)

        // Fetch user stats
        const { data: usersData } = await supabase.from('user_profiles').select('role')
        const roleCount: Record<string, number> = {}
        usersData?.forEach((u: any) => {
          roleCount[u.role] = (roleCount[u.role] || 0) + 1
        })
        const userStatsArray = Object.entries(roleCount).map(([role, count]) => ({
          role,
          count,
        }))
        setUserStats(userStatsArray)
        setTotalUsers(usersData?.length || 0)

        // Fetch equipment count
        const { data: equipmentData } = await supabase.from('equipment').select('id')
        setTotalEquipment(equipmentData?.length || 0)

        // Fetch recent tickets
        const { data: recent } = await supabase
          .from('tickets')
          .select('id, status, description, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
        setRecentTickets(recent || [])
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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

  const COLORS = ['#fbbf24', '#60a5fa', '#a78bfa', '#fb923c', '#34d399', '#d1d5db', '#ef4444']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard de Administración</h1>
        <p className="text-slate-600">Resumen general del sistema de tickets</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Tickets</CardTitle>
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalTickets}</div>
            <p className="text-xs text-slate-600 mt-1">Tickets en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Usuarios Activos</CardTitle>
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalUsers}</div>
            <p className="text-xs text-slate-600 mt-1">Clientes, técnicos y admins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Equipos Disponibles</CardTitle>
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalEquipment}</div>
            <p className="text-xs text-slate-600 mt-1">Aires acondicionados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">En Proceso</CardTitle>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {ticketStats.find((s) => s.status === 'asignado')?.count || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">Tickets asignados</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Estado</CardTitle>
            <CardDescription>Distribución de tickets según su estado</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center text-slate-600">
                Cargando...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Usuarios</CardTitle>
            <CardDescription>Por tipo de rol</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center text-slate-600">
                Cargando...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, count }) => `${role}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets Recientes</CardTitle>
          <CardDescription>Últimos 5 tickets creados</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
