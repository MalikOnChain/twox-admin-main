import { api } from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { IFriendsListResponse, IRewardsListResponse } from '@/types/affiliate'

export const getSelfReferralCode = async (): Promise<string> => {
  try {
    const response = await api.get<{ code: string; error?: any }>(
      '/affiliate/code'
    )
    return response.data.code
  } catch (error) {
    handleApiError(error, 'Failed to get self referral code')
  }
}
export const getFriends = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<IFriendsListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<IFriendsListResponse>('/affiliate/users', {
      params,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get friends')
  }
}

export const getRewards = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<IRewardsListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<IRewardsListResponse>('/affiliate/rewards', {
      params,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get rewards')
  }
}
