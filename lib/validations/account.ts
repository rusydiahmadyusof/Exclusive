import { z } from 'zod'

export const accountProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
})

export const accountPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const accountAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  companyName: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required').min(5, 'Please enter a valid address'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(1, 'Postcode is required').regex(/^\d{5}$/, 'Postcode must be 5 digits'),
  phoneNumber: z.string().min(1, 'Phone number is required').regex(/^(\+?60|0)[1-9]\d{8,9}$/, 'Please enter a valid Malaysian phone number (e.g., +60123456789 or 0123456789)'),
  emailAddress: z.string().email('Invalid email address'),
  isDefault: z.boolean().optional(),
})

export type AccountProfileFormData = z.infer<typeof accountProfileSchema>
export type AccountPasswordFormData = z.infer<typeof accountPasswordSchema>
export type AccountAddressFormData = z.infer<typeof accountAddressSchema>

