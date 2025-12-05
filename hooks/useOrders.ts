import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Order } from '@/lib/types/database'

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders')

      if (!response.ok) {
        if (response.status === 401) {
          return [] // Return empty array if not authenticated
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch orders')
      }

      const { orders } = await response.json()
      return orders
    },
    retry: false, // Don't retry on 401
  })
}

export const useOrder = (id: string | undefined) => {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required')

      const response = await fetch(`/api/orders/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found')
        }
        const { error } = await response.json()
        throw new Error(error || 'Failed to fetch order')
      }

      const { order } = await response.json()
      return order
    },
    enabled: !!id,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderData: {
      items: Array<{
        product_id: string
        product_name: string
        product_image_url: string | null
        quantity: number
        price: number
      }>
      shipping_address_id?: string
      payment_method?: 'bank' | 'cash' | 'card'
      coupon_code?: string
      subtotal: number
      shipping: number
      discount: number
      total: number
    }) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to create order')
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

