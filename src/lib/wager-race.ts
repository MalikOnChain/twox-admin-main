import moment from 'moment'
import { z } from 'zod'

import { GAME_CATEGORIES } from '@/types/game'
import {
  DELAY_TYPE,
  PARTICIPANT_TYPE,
  PAYOUT_TYPE,
  PRIZE_TYPE,
  WAGER_RACE_STATUS,
} from '@/types/wagerRace'

const statusOptions = Object.entries(WAGER_RACE_STATUS).map(([key, value]) => ({
  label: key,
  value,
}))

const participantTypeOptions = Object.entries(PARTICIPANT_TYPE).map(
  ([key, value]) => ({
    label: key,
    value,
  })
)

const prizeTypeOptions = Object.entries(PRIZE_TYPE).map(([key, value]) => ({
  label: key,
  value,
}))

const eligibleGamesOptions = Object.entries(GAME_CATEGORIES).map(
  ([key, value]) => ({
    label: key,
    value,
  })
)

const payoutTypeOptions = Object.entries(PAYOUT_TYPE).map(([key, value]) => ({
  label: key,
  value,
}))

const delayTypeOptions = Object.entries(DELAY_TYPE).map(([key, value]) => ({
  label: key,
  value,
}))

// 🧾 Zod schema
export const wagerRaceFormSchema = z
  .object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().nullable().optional(),
    minWager: z.number().min(0, 'Minimum wager is required'),
    prize: z.object({
      type: z.nativeEnum(PRIZE_TYPE).default(PRIZE_TYPE.FIXED),
      amounts: z
        .array(z.number().min(0, 'Prize amount is required'))
        .min(1, 'Prize amounts must have at least one amount'),
    }),
    eligibleGames: z.array(z.string()),

    participants: z.object({
      type: z.nativeEnum(PARTICIPANT_TYPE).default(PARTICIPANT_TYPE.ALL),
      code: z.string().nullable().optional(),
      tiers: z.array(z.string()).nullable().optional(),
    }),

    period: z.object({
      start: z.string().min(1, 'Start date required'),
      end: z.string().min(1, 'End date required'),
    }),
    status: z
      .nativeEnum(WAGER_RACE_STATUS)
      .default(WAGER_RACE_STATUS.SCHEDULED),
    payoutType: z.nativeEnum(PAYOUT_TYPE).default(PAYOUT_TYPE.AUTO),
    delay: z.object({
      type: z.nativeEnum(DELAY_TYPE).default(DELAY_TYPE.HOUR),
      value: z.number().min(0, 'Delay value is required'),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.title.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['title'],
        message: 'Title is required',
      })
    }

    if (data.minWager <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['minWager'],
        message: 'Minimum wager is required',
      })
    }
    if (data.prize.type === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['prize.type'],
        message: 'Prize type is required',
      })
    }

    if (data.prize.amounts.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['prize.amounts'],
        message: 'Prize amounts is required',
      })
    }

    if (
      data.prize.type === PRIZE_TYPE.PERCENTAGE &&
      data.prize.amounts.some((amount) => amount > 100)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['prize.amounts'],
        message: 'Prize amount cannot be greater than 100%',
      })
    }

    if (
      data.prize.amounts.findIndex(
        (amount, index) => amount <= data.prize.amounts[index + 1]
      ) > -1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['prize.amounts'],
        message: 'Please set correct amount according to tiers',
      })
    }

    if (data.eligibleGames.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['eligibleGames'],
        message: 'At least one game is required',
      })
    }

    if (data.participants.type === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['participants.type'],
        message: 'Participant type is required',
      })
    }

    if (
      data.participants.type === PARTICIPANT_TYPE.RANK &&
      data.participants.tiers.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['participants.tiers'],
        message: 'At least one tier is required',
      })
    }

    if (
      data.participants.type === PARTICIPANT_TYPE.INVITE &&
      data.participants.code.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['participants.code'],
        message: 'At least one user is required',
      })
    }

    if (data.period.start === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['period.start'],
        message: 'Start date is required',
      })
    }

    if (data.period.end === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['period.end'],
        message: 'End date is required',
      })
    }

    if (moment(data.period.start).isAfter(moment(data.period.end))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['period.start'],
        message: 'Start date cannot be greater than end date',
      })
    }

    if (data.payoutType === PAYOUT_TYPE.MANUAL && data.delay.value <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['delay.value'],
        message: 'Delay value is required',
      })
    }
  })

export type WagerRaceFormValues = z.infer<typeof wagerRaceFormSchema>

export {
  delayTypeOptions,
  eligibleGamesOptions,
  participantTypeOptions,
  payoutTypeOptions,
  prizeTypeOptions,
  statusOptions,
}
