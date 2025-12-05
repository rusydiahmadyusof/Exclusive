import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/lib/types/database'

export const useSearch = (query: string, enabled: boolean = true) => {
  return useQuery<Product[]>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) {
        return []
      }

      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to search products')
      }

      const { products } = await response.json()
      return products
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 30 * 1000, // 30 seconds for search results
  })
}

