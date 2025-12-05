import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/lib/types/database'

export const useProduct = (id: string | undefined) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required')

      const response = await fetch(`/api/products/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found')
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch product')
      }

      const { product } = await response.json()
      return product
    },
    enabled: !!id,
  })
}

