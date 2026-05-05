import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, CartItem, Extra, MenuItem, User } from '@/types'

// ─── Auth Store ──────────────────────────────────────────────────────────────
interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: 'auth-store' },
  ),
)

// ─── Cart Store ──────────────────────────────────────────────────────────────
interface CartStore {
  cart: Cart
  isOpen: boolean
  addItem: (item: MenuItem, restaurantId: number, restaurantName: string, extras?: Extra[]) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getItemCount: () => number
}

const emptyCart: Cart = {
  restaurant_id: null,
  restaurant_name: '',
  items: [],
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: emptyCart,
      isOpen: false,

      addItem: (item, restaurantId, restaurantName, extras = []) => {
        const { cart } = get()

        // If different restaurant, confirm and reset
        if (cart.restaurant_id && cart.restaurant_id !== restaurantId) {
          if (!confirm(`Votre panier contient des articles de ${cart.restaurant_name}. Vider le panier et continuer ?`)) return
          set({ cart: emptyCart })
        }

        set((state) => {
          const existing = state.cart.items.find(
            (ci) => ci.item.id === item.id && JSON.stringify(ci.extras) === JSON.stringify(extras),
          )

          if (existing) {
            return {
              cart: {
                ...state.cart,
                items: state.cart.items.map((ci) =>
                  ci === existing ? { ...ci, quantity: ci.quantity + 1 } : ci,
                ),
              },
            }
          }

          const newItem: CartItem = { item, quantity: 1, extras }
          return {
            cart: {
              restaurant_id: restaurantId,
              restaurant_name: restaurantName,
              items: [...state.cart.items, newItem],
            },
          }
        })
      },

      removeItem: (itemId) =>
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.filter((ci) => ci.item.id !== itemId),
          },
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: {
            ...state.cart,
            items:
              quantity <= 0
                ? state.cart.items.filter((ci) => ci.item.id !== itemId)
                : state.cart.items.map((ci) =>
                    ci.item.id === itemId ? { ...ci, quantity } : ci,
                  ),
          },
        })),

      clearCart: () => set({ cart: emptyCart }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      getSubtotal: () => {
        const { cart } = get()
        return cart.items.reduce((sum, ci) => {
          const extrasTotal = ci.extras.reduce((e, ex) => e + ex.price, 0)
          return sum + (ci.item.price + extrasTotal) * ci.quantity
        }, 0)
      },

      getTotal: () => {
        return get().getSubtotal()
      },

      getItemCount: () => {
        return get().cart.items.reduce((sum, ci) => sum + ci.quantity, 0)
      },
    }),
    { name: 'cart-store' },
  ),
)

// ─── UI Store ────────────────────────────────────────────────────────────────
interface UIStore {
  searchQuery: string
  selectedCuisine: string | null
  setSearchQuery: (q: string) => void
  setSelectedCuisine: (c: string | null) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  searchQuery: '',
  selectedCuisine: null,
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCuisine: (c) => set({ selectedCuisine: c }),
}))
