import { useQuery } from '@tanstack/react-query'
import type { Category } from '@/lib/types/database'

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories')

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch categories')
      }

      const { categories } = await response.json()
      return categories
    },
  })
}

