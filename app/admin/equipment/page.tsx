'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Plus, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Equipment {
  id: string
  brand: string
  model: string
  type: string
  description: string | null
  is_active: boolean
  created_at: string
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    type: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('brand', { ascending: true })

      if (error) {
        console.error('Error fetching equipment:', error)
      } else {
        setEquipment(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (eq?: Equipment) => {
    if (eq) {
      setEditingEquipment(eq)
      setFormData({
        brand: eq.brand,
        model: eq.model,
        type: eq.type,
        description: eq.description || '',
      })
    } else {
      setEditingEquipment(null)
      setFormData({
        brand: '',
        model: '',
        type: '',
        description: '',
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const supabase = createClient()

      if (editingEquipment) {
        // Update
        const { error } = await supabase
          .from('equipment')
          .update(formData)
          .eq('id', editingEquipment.id)

        if (error) {
          toast.error(error.message)
          return
        }

        setEquipment(
          equipment.map((eq) =>
            eq.id === editingEquipment.id ? { ...eq, ...formData } : eq
          )
        )
        toast.success('Equipo actualizado')
      } else {
        // Insert
        const { data, error } = await supabase
          .from('equipment')
          .insert([formData])
          .select()

        if (error) {
          toast.error(error.message)
          return
        }

        if (data) {
          setEquipment([...equipment, ...data])
          toast.success('Equipo creado')
        }
      }

      setShowModal(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al guardar el equipo')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro que deseas eliminar este equipo?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('equipment').delete().eq('id', id)

      if (error) {
        toast.error(error.message)
        return
      }

      setEquipment(equipment.filter((eq) => eq.id !== id))
      toast.success('Equipo eliminado')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar el equipo')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestión de Equipos</h1>
          <p className="text-slate-600">Administra el catálogo de aires acondicionados</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Agregar Equipo
        </Button>
      </div>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipos Disponibles</CardTitle>
          <CardDescription>Total: {equipment.length} equipos</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-600">Cargando equipos...</div>
          ) : equipment.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600">No hay equipos registrados</p>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 gap-2"
                onClick={() => handleOpenModal()}
              >
                <Plus className="w-4 h-4" />
                Agregar Primer Equipo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-semibold">{eq.brand}</TableCell>
                      <TableCell>{eq.model}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{eq.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {eq.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={eq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {eq.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(eq)}
                          className="gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(eq.id)}
                          className="gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
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

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEquipment ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}</DialogTitle>
            <DialogDescription>
              {editingEquipment
                ? 'Actualiza la información del equipo'
                : 'Ingresa los detalles del nuevo equipo'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="ej: Samsung, LG, Daikin"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="ej: AR5500"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="ej: Split, Ventana, Portátil"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción adicional (opcional)"
                disabled={submitting}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
