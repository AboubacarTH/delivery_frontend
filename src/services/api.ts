import axios from 'axios'
import type { Restaurant, Category, Order, User, PaginatedResponse, ApiResponse } from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Auto-attach Bearer token
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth-store')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch {}
  }
  return config
})

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth-store')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<ApiResponse<User> & { token: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<User> & { token: string }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<ApiResponse<User>>('/auth/me'),
}

// ─── Restaurants ─────────────────────────────────────────────────────────────
export const restaurantsApi = {
  list: (params?: {
    search?: string
    cuisine?: string
    sort?: string
    open_only?: boolean
    per_page?: number
    page?: number
  }) => api.get<PaginatedResponse<Restaurant>>('/restaurants', { params }),

  show: (slug: string) =>
    api.get<ApiResponse<Restaurant & { categories: Category[] }>>(`/restaurants/${slug}`),

  menu: (slug: string) => api.get<ApiResponse<Category[]>>(`/restaurants/${slug}/menu`),
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export const ordersApi = {
  list: (page = 1) =>
    api.get<PaginatedResponse<Order>>('/orders', { params: { page } }),

  show: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),

  create: (data: {
    restaurant_id: number
    items: Array<{
      menu_item_id: number
      quantity: number
      extras?: number[]
      note?: string
    }>
    delivery_address: { street: string; city: string; zip?: string }
    payment_method: 'card' | 'cash'
    notes?: string
  }) => api.post<ApiResponse<Order>>('/orders', data),

  cancel: (id: number) => api.post<ApiResponse<Order>>(`/orders/${id}/cancel`),
}

// ─── User ────────────────────────────────────────────────────────────────────
export const userApi = {
  profile: () => api.get<ApiResponse<User>>('/user/profile'),

  update: (data: Partial<User>) => api.put<ApiResponse<User>>('/user/profile', data),

  addresses: () => api.get('/user/addresses'),

  addAddress: (data: {
    label?: string
    street: string
    city: string
    zip?: string
    is_default?: boolean
  }) => api.post('/user/addresses', data),
}

export default api
