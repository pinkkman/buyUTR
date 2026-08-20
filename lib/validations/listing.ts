import { z } from 'zod';
import { CONDITIONS, CAMPUS_LOCATIONS } from '@/lib/constants';

export const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  price: z.coerce.number().min(0).max(10000000),
  category: z.string().min(1, 'Category is required'),
  condition: z.enum(CONDITIONS),
  location: z.enum(CAMPUS_LOCATIONS),
  negotiable: z.boolean().default(false),
  exchangeAvailable: z.boolean().default(false),
  rentalAvailable: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export type CreateListingInput = z.infer<typeof createListingSchema>;