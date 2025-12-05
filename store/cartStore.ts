import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/lib/types/database'

interface CartStoreItem {
  id: string
  productId: string
  product: Product
  quantity: number
}

interface CartStore {
  items: CartStoreItem[]
  isLoading: boolean
  error: string | null
  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: (product, quantity = 1) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.productId === product.id)

        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: currentItems.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          // Add new item
          set({
            items: [
              ...currentItems,
              {
                id: `${product.id}-${Date.now()}`,
                productId: product.id,
                product,
                quantity,
              },
            ],
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [], error: null })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + item.product.price * item.quantity
        }, 0)
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
      },
    }),
    {
      name: 'cart-storage',
      // Only persist items, not loading/error states
      partialize: (state) => ({ items: state.items }),
    }
  )
)

