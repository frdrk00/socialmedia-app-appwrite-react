import * as z from 'zod'

export const SignupValidation = z.object({
  name: z.string().min(2, { message: 'Too short' }),
  username: z.string().min(2, { message: 'Too short' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
})

export const SigninValidation = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
})

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: 'Too short' })
    .max(2000, { message: 'Too long' }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(2, { message: 'Too short' })
    .max(200, { message: 'Too long' }),
  tags: z.string(),
})
