import { z } from 'zod'

export const gameProviderFormSchema = z.object({
  banner: z.string().optional().nullable(), // Image URL is required
})

export type GameProviderFormValues = z.infer<typeof gameProviderFormSchema>
