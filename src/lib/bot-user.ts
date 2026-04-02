import { z } from 'zod'

export const botUserFormSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    avatar: z.string().optional(),

    wager: z.number().min(0, 'Wager must be a positive number'),
    rank: z.string().min(1, 'Rank is required'),

    maxMultiplier: z
      .number()
      .min(1.1, 'Maximum multiplier must be at least 1.1')
      .default(50),

    minMultiplier: z
      .number()
      .min(1.1, 'Minimum multiplier must be at least 1.1')
      .default(1.1),

    maxBet: z.number().min(0.2, 'Maximum bet must be at least 0.2').default(20),

    minBet: z
      .number()
      .min(0.1, 'Minimum bet must be at least 0.1')
      .default(0.2),
  })
  .superRefine((data, ctx) => {
    // Validate that maxMultiplier is greater than minMultiplier
    if (data.maxMultiplier <= data.minMultiplier) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxMultiplier'],
        message: 'Maximum multiplier must be greater than minimum multiplier',
      })
    }

    // Validate that maxBet is greater than minBet
    if (data.maxBet <= data.minBet) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxBet'],
        message: 'Maximum bet must be greater than minimum bet',
      })
    }
  })

export type BotUserFormValues = z.infer<typeof botUserFormSchema>
