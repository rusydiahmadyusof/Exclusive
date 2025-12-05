import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/types/database'

interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: (product) => {
        const currentItems = get().items
        const exists = currentItems.some((item) => item.productId === product.id)

        if (!exists) {
          set({
            items: [
              ...currentItems,
              {
                id: `${product.id}-${Date.now()}`,
                productId: product.id,
                product,
                addedAt: new Date().toISOString(),
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

      clearWishlist: () => {
        set({ items: [], error: null })
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
      },
    }),
    {
      name: 'wishlist-storage',
      // Only persist items, not loading/error states
      partialize: (state) => ({ items: state.items }),
    }
  )
)

