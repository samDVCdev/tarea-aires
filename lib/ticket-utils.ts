export const TICKET_STATUSES = [
  'en_espera',
  'asignado',
  'diagnostico',
  'aprobado',
  'reparado',
  'finalizado',
  'cancelado',
] as const

export const STATUS_LABELS: Record<string, string> = {
  en_espera: 'En Espera',
  asignado: 'Asignado',
  diagnostico: 'Diagnóstico',
  aprobado: 'Aprobado',
  reparado: 'Reparado',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
}

export const STATUS_COLORS: Record<string, string> = {
  en_espera: 'bg-yellow-100 text-yellow-800',
  asignado: 'bg-blue-100 text-blue-800',
  diagnostico: 'bg-purple-100 text-purple-800',
  aprobado: 'bg-green-100 text-green-800',
  reparado: 'bg-indigo-100 text-indigo-800',
  finalizado: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800',
}

export const USER_ROLES = {
  cliente: 'Cliente',
  tecnico: 'Técnico',
  administrador: 'Administrador',
} as const

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}

export function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return '$0.00'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
