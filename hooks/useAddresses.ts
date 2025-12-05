import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Address } from '@/lib/types/database'
import type { AccountAddressFormData } from '@/lib/validations/account'

export const useAddresses = () => {
  return useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await fetch('/api/addresses')
      if (!response.ok) {
        if (response.status === 401) {
          return []
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch addresses')
      }
      const { addresses } = await response.json()
      return addresses
    },
    retry: false,
  })
}

export const useCreateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AccountAddressFormData) => {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to create address')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AccountAddressFormData }) => {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to update address')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to delete address')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

