// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: Address
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ─── Address ────────────────────────────────────────────────────────────────
export interface Address {
  id?: number
  label?: string
  street: string
  city: string
  zip: string
  country?: string
  lat?: number
  lng?: number
}

// ─── Restaurant ──────────────────────────────────────────────────────────────
export interface Restaurant {
  id: number
  name: string
  slug: string
  description: string
  image: string
  logo: string
  cuisine: string[]
  rating: number
  review_count: number
  delivery_time: number
  delivery_fee: number
  min_order: number
  is_open: boolean
  address: Address
  featured?: boolean
  promo?: string
}

// ─── Menu ────────────────────────────────────────────────────────────────────
export interface Category {
  id: number
  name: string
  items: MenuItem[]
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image?: string
  category_id: number
  tags?: string[]
  is_available: boolean
  extras?: Extra[]
}

export interface Extra {
  id: number
  name: string
  price: number
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  item: MenuItem
  quantity: number
  extras: Extra[]
  note?: string
}

export interface Cart {
  restaurant_id: number | null
  restaurant_name: string
  items: CartItem[]
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: number
  reference: string
  status: OrderStatus
  restaurant: Restaurant
  items: OrderItem[]
  delivery_address: Address
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  payment_method: 'card' | 'cash'
  estimated_delivery?: string
  created_at: string
  updated_at: string
  driver?: Driver
}

export interface OrderItem {
  id: number
  menu_item: MenuItem
  quantity: number
  unit_price: number
  extras: Extra[]
  note?: string
}

// ─── Driver ──────────────────────────────────────────────────────────────────
export interface Driver {
  id: number
  name: string
  avatar?: string
  phone: string
  vehicle: string
  rating: number
  lat?: number
  lng?: number
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// ─── API Response ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
}
