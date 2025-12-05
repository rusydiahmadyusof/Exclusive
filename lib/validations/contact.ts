import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  message: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

