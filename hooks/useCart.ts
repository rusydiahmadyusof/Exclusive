import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CartItem } from '@/lib/types/database'

export const useCart = () => {
  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart')

      if (!response.ok) {
        if (response.status === 401) {
          return [] // Return empty array if not authenticated
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch cart')
      }

      const { items } = await response.json()
      return items
    },
    retry: false, // Don't retry on 401
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ product_id, quantity = 1 }: { product_id: string; quantity?: number }) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id, quantity }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to add to cart')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to update cart item')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to remove from cart')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

