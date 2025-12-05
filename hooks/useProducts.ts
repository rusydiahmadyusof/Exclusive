import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/lib/types/database'

interface UseProductsOptions {
  category?: string
  search?: string
  featured?: boolean
  bestSelling?: boolean
  newArrival?: boolean
  flashSale?: boolean
  limit?: number
  enabled?: boolean
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    category,
    search,
    featured,
    bestSelling,
    newArrival,
    flashSale,
    limit = 100,
    enabled = true,
  } = options

  return useQuery<Product[]>({
    queryKey: ['products', category, search, featured, bestSelling, newArrival, flashSale, limit],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (category) params.append('category', category)
      if (search) params.append('search', search)
      if (featured) params.append('featured', 'true')
      if (bestSelling) params.append('bestSelling', 'true')
      if (newArrival) params.append('newArrival', 'true')
      if (flashSale) params.append('flashSale', 'true')
      if (limit) params.append('limit', limit.toString())

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch products')
      }

      const { products } = await response.json()
      return products
    },
    enabled,
  })
}

