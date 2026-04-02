import { z } from 'zod'

export enum RewardStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export interface ReferralUserReward {
  _id?: string
  name: string
  amount: number
  description?: string
  requiredReferralCount: number
  status: RewardStatus
}

export const RewardStatusOptions = [
  { value: RewardStatus.ACTIVE, label: 'Active' },
  { value: RewardStatus.INACTIVE, label: 'Inactive' },
]

export const ReferralUserRewardFormSchema = z.object({
  name: z.string().min(2, 'Reward name is required'),
  amount: z.number().min(1, 'Reward amount is required'),
  description: z.string(),
  requiredReferralCount: z.number().min(1, 'Referral Users is required'),
  status: z.nativeEnum(RewardStatus),
})

export type ReferralUserRewardFormValues = z.infer<
  typeof ReferralUserRewardFormSchema
>

/**
 * Response from the API with a list of rewards
 */
export interface ReferralUserRewardListResponse {
  rows: ReferralUserReward[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
  }
}

/**
 * Response from the API with a single reward
 */
export interface ReferralUserRewardResponse {
  reward: ReferralUserReward
}

/**
 * Success response from create/update/delete operations
 */
export interface ReferralUserRewardSuccessResponse {
  message: string
  reward?: ReferralUserReward
  error?: string
}

/**
 * Error response from the API
 */
export interface ReferralUserRewardErrorResponse {
  message: string
}
