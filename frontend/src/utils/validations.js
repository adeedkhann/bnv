import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
  email: z.string().email('Enter a valid email.'),
  mobile: z
    .string()
    .min(7, 'Mobile number must be at least 7 digits.')
    .max(15, 'Mobile number must be at most 15 digits.')
    .regex(/^[0-9+\-()\s]+$/, 'Enter a valid mobile number.'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Select a gender.' }),
  status: z.enum(['active', 'inactive'], { message: 'Select a status.' }),
  location: z.string().optional(),
  profileImage: z.any().optional(),
});
