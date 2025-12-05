import { create } from 'zustand'
import type { Product, Category } from '@/lib/types/database'

interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'name'
}

interface ProductStore {
  // Products
  products: Product[]
  featuredProducts: Product[]
  bestSellingProducts: Product[]
  newArrivalProducts: Product[]
  flashSaleProducts: Product[]
  currentProduct: Product | null
  
  // Categories
  categories: Category[]
  selectedCategory: Category | null
  
  // Filters & Search
  filters: ProductFilters
  searchQuery: string
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Actions - Products
  setProducts: (products: Product[]) => void
  setFeaturedProducts: (products: Product[]) => void
  setBestSellingProducts: (products: Product[]) => void
  setNewArrivalProducts: (products: Product[]) => void
  setFlashSaleProducts: (products: Product[]) => void
  setCurrentProduct: (product: Product | null) => void
  
  // Actions - Categories
  setCategories: (categories: Category[]) => void
  setSelectedCategory: (category: Category | null) => void
  
  // Actions - Filters
  setFilters: (filters: Partial<ProductFilters>) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
  
  // Actions - UI
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultFilters: ProductFilters = {
  sortBy: 'newest',
}

export const useProductStore = create<ProductStore>((set) => ({
  // Initial state
  products: [],
  featuredProducts: [],
  bestSellingProducts: [],
  newArrivalProducts: [],
  flashSaleProducts: [],
  currentProduct: null,
  
  categories: [],
  selectedCategory: null,
  
  filters: defaultFilters,
  searchQuery: '',
  
  isLoading: false,
  error: null,
  
  // Product actions
  setProducts: (products) => set({ products }),
  
  setFeaturedProducts: (products) => set({ featuredProducts: products }),
  
  setBestSellingProducts: (products) => set({ bestSellingProducts: products }),
  
  setNewArrivalProducts: (products) => set({ newArrivalProducts: products }),
  
  setFlashSaleProducts: (products) => set({ flashSaleProducts: products }),
  
  setCurrentProduct: (product) => set({ currentProduct: product }),
  
  // Category actions
  setCategories: (categories) => set({ categories }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  // Filter actions
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  clearFilters: () => set({ filters: defaultFilters, searchQuery: '' }),
  
  // UI actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}))

