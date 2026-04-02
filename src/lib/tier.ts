import { z } from 'zod'

export const tierFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    levels: z
      .array(
        z.object({
          level: z.number().min(1, 'Level must be greater than 0'),
          minXP: z.number(),
          name: z.string().min(1, 'Name is required').default(''),
          icon: z.string().optional().nullable(),
        })
      )
      .min(1, 'Levels are required'),
    downgradePeriod: z
      .number()
      .min(0, 'Downgrade period must be greater than 0'),
    icon: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const levelDuplicates = data.levels
      .map((l) => l.level)
      .filter((level, index, self) => self.indexOf(level) !== index)

    if (levelDuplicates.length > 0) {
      data.levels.forEach((_, index) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Level must be unique',
          path: ['levels', index, 'level'],
        })
      })
    }

    const minXPs = data.levels.map((l) => l.minXP)

    if (minXPs.length > 0) {
      minXPs.forEach((minXP, index) => {
        if (index > 0 && minXP <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Min XP must be greater than 0',
            path: ['levels', index, 'minXP'],
          })
        }
      })
    }
  })

export type TierFormValues = z.infer<typeof tierFormSchema>
