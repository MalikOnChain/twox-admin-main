import moment from 'moment'
import { z } from 'zod'

// Updated to match backend bonus types
enum BonusType {
  WELCOME = 'welcome',
  DEPOSIT = 'deposit',
  RECURRING = 'recurring',
  CUSTOM = 'custom',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  REFERRAL = 'referral',
}

enum ClaimMethod {
  AUTO = 'auto',
  MANUAL = 'manual',
  CODE = 'code',
}

enum EligibleUsers {
  ALL = 'all',
  RANK = 'rank',
  USER_LIST = 'userList',
}

enum GameRestrictionsCategories {
  ALL = 'all',
  SLOTS = 'slots',
  LIVE_CASINO = 'live-casino',
}

enum BonusStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}

export enum BonusRewardType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed-amount',
  RANDOM_AMOUNT = 'random-amount',
}

enum ChallengeType {
  PLAY_GAMES = 'PLAY_GAMES',
  WAGER_AMOUNT = 'WAGER_AMOUNT',
  WIN_AMOUNT = 'WIN_AMOUNT',
  WIN_MULTIPLIER = 'WIN_MULTIPLIER',
  PLAY_GAME_CATEGORY = 'PLAY_GAME_CATEGORY',
  WIN_COUNT = 'WIN_COUNT',
}

const allowedDays = [0, 1, 2, 3, 4, 5, 6]

const bonusTypeOptions = Object.entries(BonusType).map(([key, value]) => ({
  label: key.replace(/_/g, ' '),
  value,
}))

const claimMethodOptions = Object.entries(ClaimMethod).map(([key, value]) => ({
  label: key.toLowerCase(),
  value,
}))

const statusOptions = Object.entries(BonusStatus).map(([key, value]) => ({
  label: key.toLowerCase(),
  value,
}))

const challengeTypeOptions = Object.entries(ChallengeType).map(
  ([key, value]) => ({
    label: key.replace(/_/g, ' '),
    value,
  })
)

// Updated schema with metadata support
export const bonusFormSchema = z
  .object({
    name: z.string().min(2, 'Bonus name is required'),
    description: z.string().min(2, 'Description is required'),
    type: z.nativeEnum(BonusType),
    wagerMultiplier: z.number().min(1, 'Wager amount is required').default(1),

    // Claim Requirements
    depositCount: z.number().optional(),
    minDepositAmount: z.number().optional(),

    // Rewards
    rewardType: z.nativeEnum(BonusRewardType),
    percentage: z.number().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().min(0, 'Max amount must be non-negative').optional(),
    freeSpins: z.number().optional(),
    realMoney: z.number().optional(),

    allowedDays: z.array(z.number()).optional(),
    claimMethod: z.nativeEnum(ClaimMethod),
    code: z.string().optional().nullable(),

    validFrom: z.string().min(1, 'Start date required'),
    validTo: z.string().optional().nullable(),
    hasExpiry: z.boolean().default(false),
    hasRequirements: z.boolean().default(true),

    eligibleUsersType: z.nativeEnum(EligibleUsers),
    eligibleUsers: z.array(z.string()),
    status: z.nativeEnum(BonusStatus),

    // Metadata fields for different bonus types
    metadata: z
      .object({
        // Game Specific
        gameId: z.string().optional(),
        gameCategory: z.string().optional(),
        requiredGames: z.number().optional(),
        minBetAmount: z.number().optional(),

        // Win Streak
        requiredWins: z.number().optional(),
        timeWindow: z.number().optional(),

        // Milestone
        milestoneType: z.string().optional(),
        milestoneAmount: z.number().optional(),
        targetValue: z.number().optional(),
        autoAwarded: z.boolean().optional(),

        // Loss Rebate
        timeWindowHours: z.number().optional(),
        minLossAmount: z.number().optional(),
        rebatePercentage: z.number().optional(),
        maxRebateAmount: z.number().optional(),

        // Deposit Series
        seriesPosition: z.number().optional(),
        matchPercentage: z.number().optional(),

        // Challenge
        requiredCompletions: z.number().optional(),
        challenges: z
          .array(
            z.object({
              type: z.nativeEnum(ChallengeType),
              gameCategory: z.string().optional(),
              count: z.number().optional(),
              amount: z.number().optional(),
              multiplier: z.number().optional(),
              category: z.string().optional(),
              description: z.string().optional(),
            })
          )
          .optional(),

        // VIP Level Up
        targetTier: z.string().optional(),
        targetLevel: z.string().optional(),
        requireWagering: z.boolean().optional(),

        // Points Exchange
        pointsRequired: z.number().optional(),
        exchangeRate: z.number().optional(),
        minPoints: z.number().optional(),
        maxPoints: z.number().optional(),

        // Reactivation
        requiredInactiveDays: z.number().optional(),
        depositRequired: z.boolean().optional(),

        // Time Boost Cashback
        tiers: z
          .array(
            z.object({
              tierName: z.string(),
              tierLevel: z.string(),
              percentage: z.number(),
              cap: z.object({
                day: z.number(),
                week: z.number(),
                month: z.number(),
              }),
              minWagering: z.number().optional(),
            })
          )
          .optional(),
        timeWindows: z
          .array(
            z.object({
              days: z.array(z.number()),
              startHour: z.number(),
              endHour: z.number(),
              boostMultiplier: z.number(),
            })
          )
          .optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if ([ClaimMethod.AUTO, ClaimMethod.CODE].includes(data.claimMethod)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['claimMethod'],
        message:
          'Only MANUAL claim method is allowed at this time. Other methods will be coming soon',
      })
    }

    // Welcome bonus validations
    if (data.type === BonusType.WELCOME) {
      if (data.hasRequirements) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['hasRequirements'],
          message: 'No requirements for Welcome Bonus',
        })
      }
    }

    // Deposit bonus validations
    if (data.type === BonusType.DEPOSIT) {
      if (!data.depositCount || data.depositCount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['depositCount'],
          message: 'Deposit count is required when type is DEPOSIT',
        })
      }
      if (!data.minDepositAmount || data.minDepositAmount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['minDepositAmount'],
          message: 'Min deposit amount is required when type is DEPOSIT',
        })
      }
    }

    // Date validations
    if (data.hasExpiry && (!data.validTo || data.validTo.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['validTo'],
        message: 'Valid To is required when "Has Expiry" is checked',
      })
    }

    if (data.hasExpiry && data.validFrom && data.validTo) {
      if (moment(data.validFrom).isAfter(moment(data.validTo))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['validFrom'],
          message: 'Valid From must be before Valid To',
        })
      }
    }

    // Eligibility validations
    if (
      data.eligibleUsersType !== EligibleUsers.ALL &&
      (!data.eligibleUsers || data.eligibleUsers.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['eligibleUsers'],
        message: `You must select at least one ${data.eligibleUsersType === EligibleUsers.RANK ? 'tier' : 'user'} when eligible users type is not ALL`,
      })
    }

    // Code validations
    if (data.claimMethod === ClaimMethod.CODE && !data.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['code'],
        message: 'Code is required when claim method is CODE',
      })
    }
  })

export type BonusFormValues = z.infer<typeof bonusFormSchema>

export {
  allowedDays,
  BonusStatus,
  BonusType,
  bonusTypeOptions,
  ChallengeType,
  challengeTypeOptions,
  ClaimMethod,
  claimMethodOptions,
  EligibleUsers,
  GameRestrictionsCategories,
  statusOptions,
}
