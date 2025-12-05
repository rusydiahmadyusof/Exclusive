// Database type definitions
// These types match your Supabase database schema

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  images: string[] | null
  category_id: string | null
  stock: number
  rating: number
  reviews_count: number
  is_featured: boolean
  is_new_arrival: boolean
  is_best_selling: boolean
  is_flash_sale: boolean
  flash_sale_discount: number | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product // Joined product data
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product // Joined product data
}

export interface Address {
  id: string
  user_id: string
  first_name: string
  last_name: string
  company_name: string | null
  street_address: string
  apartment: string | null
  city: string
  state: string
  postcode: string
  phone_number: string
  email_address: string | null
  is_default: boolean
  created_at: string
  updated_at: string
  // Legacy field for backward compatibility
  town_city?: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'bank' | 'cash' | 'card' | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address_id: string | null
  coupon_code: string | null
  created_at: string
  updated_at: string
  shipping_address?: Address // Joined address data
  items?: OrderItem[] // Joined order items
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image_url: string | null
  quantity: number
  price: number
  created_at: string
  product?: Product // Joined product data
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  order_id: string | null
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  user?: {
    id: string
    email: string
    // Add other user fields as needed
  }
}

