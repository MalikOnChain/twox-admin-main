import { z } from 'zod'

import { GAME_CATEGORIES } from '@/types/game'

const tierSchema = z.object({
  tierId: z.string(),
  tierName: z.string(),
  tierLevel: z.string(),
  percentage: z.number().min(0),
  minWagering: z.number().min(0),
  cap: z.object({
    day: z.number().min(0),
    week: z.number().min(0),
    month: z.number().min(0),
  }),
})

const claimFrequencySchema = z.object({
  mode: z.enum(['instant', 'daily', 'weekly', 'monthly']),
  cooldown: z.number().min(0),
})

const timeBoostSchema = z.object({
  enabled: z.boolean(),
  from: z.string().nullable(),
  to: z.string().nullable(),
  allowedDays: z.array(z.number().min(0).max(6)),
  defaultPercentage: z.number().min(0),
})

const gameMultiplierSchema = z.object({
  gameType: z.enum(Object.values(GAME_CATEGORIES) as [string, ...string[]]),
  defaultPercentage: z.number().min(0),
})

const gameSpecificSchema = z.object({
  enabled: z.boolean(),
  multipliers: z.array(gameMultiplierSchema),
})

export const cashbackSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.number().min(0).max(3),
  tiers: z.array(tierSchema),
  claimFrequency: claimFrequencySchema,
  default: z.object({
    enabled: z.boolean(),
    defaultPercentage: z.number().min(0),
  }),
  timeBoost: timeBoostSchema,
  gameSpecific: gameSpecificSchema,
  status: z.number().min(0).max(1),
  wagerMultiplier: z.number().min(0),
})

export type CashbackFormValues = z.infer<typeof cashbackSchema>
