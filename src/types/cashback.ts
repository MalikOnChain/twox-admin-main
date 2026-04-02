import { GAME_CATEGORIES } from '@/types/game'
import { ITierData } from '@/types/tier'

export type allowedDays = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ICashbackTierCap {
  day: number
  week: number
  month: number
}

export interface ICashbackTier {
  tierId: string
  tierName: string
  tierLevel: string
  percentage: number
  cap: ICashbackTierCap
  minWagering: number
}

export interface ICashbackClaimFrequency {
  mode: 'instant' | 'daily' | 'weekly' | 'monthly'
  cooldown: number
}

export interface ICashbackDefault {
  enabled: boolean
  defaultPercentage: number
}

export interface ICashbackTimeBoost {
  enabled: boolean
  from: string | null
  to: string | null
  allowedDays: allowedDays[]
  defaultPercentage: number
}

export interface ICashbackGameMultiplier {
  gameType: GAME_CATEGORIES
  defaultPercentage: number
}

export interface ICashbackGameSpecific {
  enabled: boolean
  multipliers: ICashbackGameMultiplier[]
}

export interface ICashbackData {
  _id?: string
  name: string
  type: number // 0:default, 1: time based boost, 2: game-specific multiplier, 3: win streak
  tiers: ICashbackTier[]
  claimFrequency: ICashbackClaimFrequency
  default: ICashbackDefault
  timeBoost: ICashbackTimeBoost
  gameSpecific: ICashbackGameSpecific
  status: number // 0: inactive, 1: active
  wagerMultiplier: number
}

export interface ICashbackListResponse {
  success: boolean
  rows: {
    cashbacks: ICashbackData[]
    tiers: ITierData[]
  }
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}

export interface ICashbackUpdateResponse {
  success: boolean
  message?: string
}

export interface ICashbackTableData {
  cashbacks: ICashbackData[]
  tiers: ITierData[]
}

export const CLAIM_MODE_OPTIONS = [
  {
    value: 'instant',
    label: 'Instant',
  },
  {
    value: 'daily',
    label: 'Daily',
  },
  {
    value: 'weekly',
    label: 'Weekly',
  },
  {
    value: 'monthly',
    label: 'Monthly',
  },
]

export const RAKEBACK_TYPE_OPTIONS = [
  {
    value: 0,
    label: 'Default',
  },
  {
    value: 1,
    label: 'Time-based boost',
  },
  {
    value: 2,
    label: 'Game-specific multiplier',
  },
  {
    value: 3,
    label: 'Win streak',
  },
]

export const GAME_MULTIPLIER_OPTIONS = [
  {
    value: GAME_CATEGORIES.SLOTS,
    label: GAME_CATEGORIES.SLOTS,
  },
  {
    value: GAME_CATEGORIES.LIVE_CASINO,
    label: GAME_CATEGORIES.LIVE_CASINO,
  },
  {
    value: GAME_CATEGORIES.CRASH,
    label: GAME_CATEGORIES.CRASH,
  },
]

export interface ICashbackLogs {
  _id: string
  cashbackName: string
  userName: string
  amount: number
  userTier: string
  gameType: string
  status: string
  updatedAt: string
  cashbackType: number
}

export interface ICashbackLogsResponse {
  success: boolean
  rows: ICashbackLogs[]
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}

export const CASHBACK_TYPE_COLORS = [
  'text-blue-500',
  'text-yellow-500',
  'text-purple-500',
  'text-pink-500',
]
