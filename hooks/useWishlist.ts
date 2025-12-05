import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { WishlistItem } from '@/lib/types/database'

export const useWishlist = () => {
  return useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await fetch('/api/wishlist')

      if (!response.ok) {
        if (response.status === 401) {
          return [] // Return empty array if not authenticated
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch wishlist')
      }

      const { items } = await response.json()
      return items
    },
    retry: false, // Don't retry on 401
  })
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product_id: string) => {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to add to wishlist')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to remove from wishlist')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}

