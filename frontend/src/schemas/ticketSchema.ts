// schemas/ticketSchema.ts

import { z } from 'zod'

// Define allowed image types
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

export const ticketSchema = z.object({
    ticket: z
        .string()
        .min(10, 'Ticket details must be at least 10 characters long'),

    picture: z
        .instanceof(File)
        .refine((file) => IMAGE_TYPES.includes(file.type), {
            message:
                'Unsupported file type. Please upload JPEG, PNG, or GIF images.',
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            // 5MB limit
            message: 'File size exceeds 5MB limit.',
        }),
})
