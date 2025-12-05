import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  address: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
}

export const useProfile = () => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/account/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data = await response.json()
      return data.profile as ProfileData
    },
    enabled: isAuthenticated,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProfileData) => {
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: PasswordData) => {
      const response = await fetch('/api/account/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update password')
      }

      return response.json()
    },
  })
}

