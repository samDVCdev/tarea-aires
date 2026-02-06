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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('all')
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const supabase = createClient()

      // Get user profiles with their roles
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        toast.error(error.message)
        return
      }

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      toast.success('Usuario actualizado')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar el usuario')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      cliente: 'bg-blue-100 text-blue-800',
      tecnico: 'bg-orange-100 text-orange-800',
      administrador: 'bg-purple-100 text-purple-800',
    }
    return colors[role] || 'bg-slate-100 text-slate-800'
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      cliente: 'Cliente',
      tecnico: 'Técnico',
      administrador: 'Administrador',
    }
    return labels[role] || role
  }

  const filteredUsers = filterRole === 'all' ? users : users.filter((u) => u.role === filterRole)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestión de Usuarios</h1>
        <p className="text-slate-600">Administra los usuarios y sus roles en el sistema</p>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="cliente">Clientes</SelectItem>
              <SelectItem value="tecnico">Técnicos</SelectItem>
              <SelectItem value="administrador">Administradores</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Total: {filteredUsers.length} usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Cargando usuarios...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">No hay usuarios con este filtro</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Registrado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-semibold">{user.full_name}</TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell className="text-sm">{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleUpdateRole(user.id, value)}
                          disabled={updatingUserId === user.id}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="tecnico">Técnico</SelectItem>
                            <SelectItem value="administrador">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {users.filter((u) => u.role === 'cliente').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Técnicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {users.filter((u) => u.role === 'tecnico').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {users.filter((u) => u.role === 'administrador').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
