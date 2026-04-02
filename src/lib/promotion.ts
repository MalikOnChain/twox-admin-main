import { z } from 'zod'

export const promotionFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().optional().nullable(),
  badge: z.string().optional(),
  colorTheme: z.number().optional(),
  highlightText: z.string().optional(),
  buttons: z
    .array(
      z.object({
        text: z.string(),
        link: z.string(),
      })
    )
    .optional(),
  isPublic: z.boolean().default(true),
  bonusId: z.string().optional(),
})

export type PromotionFormValues = z.infer<typeof promotionFormSchema>
