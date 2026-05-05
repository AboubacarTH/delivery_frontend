import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}` : `${h}h`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready: 'Prête',
  picked_up: 'En route',
  delivering: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  preparing: 'badge-info',
  ready: 'badge-info',
  picked_up: 'badge-brand',
  delivering: 'badge-brand',
  delivered: 'badge-success',
  cancelled: 'bg-red-50 text-red-700 badge',
}
