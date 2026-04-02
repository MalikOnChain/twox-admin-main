// types/bonus.ts
import {
  BonusStatus,
  BonusType,
  EligibleUsers,
  GameRestrictionsCategories,
} from '@/lib/bonus' // Update path as needed

// Basic types
export type ObjectId = string
export type DateString = string

/**
 * Interface for bonus requirements
 */
export interface BonusRequirements {
  minDepositAmount?: number
  wagerMultiplier?: number
}

/**
 * Interface for eligible users configuration
 */
export interface EligibleUsersConfig {
  type: EligibleUsers
  ranks?: string[]
  userIds?: ObjectId[]
}

/**
 * Interface for game restrictions
 */
export interface GameRestrictions {
  gameIds?: string[]
  categories: GameRestrictionsCategories[]
}

/**
 * Interface for usage limits
 */
export interface UsageLimit {
  perUser: number
  global: number
}

/**
 * Interface for bonus statistics
 */
export interface BonusStats {
  totalRedemptions: number
  totalBonusGiven: number
  totalUsers: number
}

/**
 * Interface for bonus reward
 */
export interface IBonusReward {
  cash?: {
    amount: number
    percentage: number
    minAmount: number
    maxAmount: number
  }
  freeSpins?: {
    amount: number
    percentage: number
    minAmount: number
    maxAmount: number
  }
  bonus?: {
    amount: number
    percentage: number
    minAmount: number
    maxAmount: number
  }
  special?: any
}

/**
 * Main Bonus interface
 */
export interface Bonus {
  _id: string
  name: string
  code: string
  description: string
  type: BonusType
  category: string
  status: BonusStatus
  claimMethod: 'auto' | 'manual' | 'code'
  isVisible: boolean
  defaultReward?: IBonusReward
  defaultWageringMultiplier: number
  validFrom: Date
  validTo: Date
  maxClaims: number
  claimsCount: number
  maxClaimsPerUser: number
  priority: number
  displayOrder: number
  imageUrl: string
  iconUrl: string
  termsAndConditions: string
  metadata: any
  createdBy?: string
  lastModifiedBy?: string
  isExpired: boolean
  isActive: boolean
}

export interface IBonusEligibility {
  bonusId: string
  eligibilityType:
    | 'all'
    | 'vip_tiers'
    | 'user_list'
    | 'country'
    | 'registration_date'
    | 'deposit_history'
  vipTiers?: Array<{
    tierId: string
    tierName?: string
  }>
  eligibleUserIds?: string[]
  allowedCountries?: string[]
  excludedCountries?: string[]
  minAccountAge?: {
    hours?: number
    days?: number
  }
  depositRequirements?: {
    requireDeposit: boolean
    firstDepositOnly: boolean
    minDepositAmount?: number
    maxDepositAmount?: number
    minDepositCount?: number
    maxDepositsPerTimeframe?: number
    minTotalDeposits?: number
    depositTimeframe?: number
  }
  activityRequirements?: {
    minWagered?: number
    minGamesPlayed?: number
    maxInactiveDays?: number
    requiredGameCategories?: string[]
  }
  timeRestrictions?: {
    allowedDays?: number[]
    allowedHours?: {
      start: number
      end: number
    }
    timezone: string
  }
  exclusions?: {
    excludeIfHasActiveBonus: boolean
    excludedBonusTypes?: string[]
    excludeAfterClaim: boolean
  }
  customConditions?: any
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IBonusSettings {
  bonusId: string
  timingSettings: {
    cooldownPeriod?: number
    claimWindow?: number
    autoExpiry?: number
  }
  wageringSettings: {
    contributionRates: {
      slots: number
      tableGames: number
      liveGames: number
      crash: number
    }
    maxBetLimit?: number
    restrictedGames?: string[]
    wageringTimeLimit?: number
  }
  stackingRules: {
    canStackWithOtherBonuses: boolean
    allowedStackingTypes?: string[]
    maxStackingValue?: number
  }
  forfeitureRules: {
    forfeitOnWithdrawal: boolean
    forfeitOnLargeWin?: {
      threshold?: number
      enabled: boolean
    }
    partialForfeitureAllowed: boolean
  }
  withdrawalSettings: {
    maxCashoutMultiplier?: number
    minBalanceForWithdrawal?: number
    withdrawalMethods?: string[]
  }
  notificationSettings: {
    sendClaimNotification: boolean
    sendExpiryReminder: boolean
    reminderHoursBefore: number
    sendProgressUpdates: boolean
  }
  trackingSettings: {
    trackConversionRate: boolean
    trackWageringCompletion: boolean
    customTrackingEvents?: Array<{
      eventName: string
      description: string
      isActive: boolean
    }>
  }
  abusePreventionSettings: {
    maxClaimsPerIP?: number
    minTimeBetweenClaims?: number
    detectMultiAccounting: boolean
    requirePhoneVerification: boolean
  }
  featureFlags: {
    enableAdvancedWagering: boolean
    enableAutoForfeiture: boolean
    enableProgressiveUnlock: boolean
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface IBonusTierRewards {
  bonusId: string
  tierId: string
  tierName: string
  tierLevel: string
  tierReward: IBonusReward
  tierWageringMultiplier: number
  tierLimits: {
    maxClaimsPerUser: number
    dailyCap: number
    weeklyCap: number
    monthlyCap: number
  }
  tierUnlockConditions: {
    minWageredAmount: number
    minDepositAmount: number
    requiredGameCategories: string[]
    minTimeInTier: number
  }
  priority: number
  isActive: boolean
  effectiveFrom: Date
  effectiveTo: Date
  metadata: any
  isEffective: boolean
  getEffectiveReward: (defaultReward: IBonusReward) => {
    percentage: number
    fixedAmount: number
    minAmount: number
    maxAmount: number
    freeSpins: number
  }
}

/**
 * Response from the API with a list of bonuses
 */
export interface BonusListResponse {
  rows: Bonus[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
  }
}

/**
 * Response from the API with a single bonus
 */
export interface BonusResponse {
  bonus: Bonus
}

/**
 * Success response from create/update/delete operations
 */
export interface BonusSuccessResponse {
  message: string
  bonus?: Bonus
  error?: string
}

/**
 * Error response from the API
 */
export interface BonusErrorResponse {
  message: string
}

export interface BonusDetailResponse {
  bonus: Bonus
  eligibility: IBonusEligibility
  settings: IBonusSettings
  tierRewards: IBonusTierRewards[]
}
