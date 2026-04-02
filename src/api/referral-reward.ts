import api from '@/lib/api' // Assuming you have an api instance setup
import { handleApiError } from '@/lib/error'

import {
  ReferralUserRewardFormValues,
  ReferralUserRewardListResponse,
  ReferralUserRewardSuccessResponse,
} from '@/types/referral-reward'

/**
 * Create a new reward
 * @param reward The reward data to create
 * @returns The created reward data
 */
export const createReferralUserReward = async (
  reward: ReferralUserRewardFormValues
): Promise<ReferralUserRewardSuccessResponse> => {
  try {
    const res = await api.post<ReferralUserRewardSuccessResponse>(
      '/referral-user-reward',
      reward
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create referral user reward')
  }
}

export const updateReferralUserReward = async (
  id: string,
  reward: ReferralUserRewardFormValues
): Promise<ReferralUserRewardSuccessResponse> => {
  try {
    const res = await api.put<ReferralUserRewardSuccessResponse>(
      `/referral-user-reward/${id}`,
      reward
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update referral user reward')
  }
}

export const getReferralUserRewards = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: any
}): Promise<ReferralUserRewardListResponse> => {
  try {
    const res = await api.get<ReferralUserRewardListResponse>(
      '/referral-user-reward',
      {
        params: {
          page,
          limit,
          filter,
        },
      }
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get referral user rewards')
  }
}

export const deleteReferralUserReward = async (
  id: string
): Promise<ReferralUserRewardSuccessResponse> => {
  try {
    const res = await api.delete<ReferralUserRewardSuccessResponse>(
      `/referral-user-reward/${id}`
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete referral user reward')
  }
}
