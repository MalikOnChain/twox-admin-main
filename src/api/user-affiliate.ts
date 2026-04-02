import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { IAffiliateMetrics, IReferredUserListResponse } from '@/types/affiliate'
import { IUserAffiliateListResponse } from '@/types/user-affiliate'

export const getAllUserAffiliates = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<IUserAffiliateListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<IUserAffiliateListResponse>(
      '/user-affiliate/users',
      { params }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get all user affiliates')
  }
}

type UserAffiliateSettingsProps = {
  depositCommissionRate: number
}
export const getUserAffiliateSettings = async () => {
  try {
    const response =
      await api.get<UserAffiliateSettingsProps>(`/user-affiliate`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get metrics by user')
  }
}

export const storeUserAffiliateSetting = async (
  setting: UserAffiliateSettingsProps
) => {
  try {
    const response = await api.post<UserAffiliateSettingsProps>(
      '/user-affiliate',
      setting
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to save')
  }
}

export const getMetricsByUser = async ({ id }: { id: string }) => {
  try {
    const response = await api.get<IAffiliateMetrics>(
      `/user-affiliate/${id}/metrics`
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get metrics by user')
  }
}

export const getReferredUsersByUser = async ({
  page,
  limit,
  id,
}: {
  page: number
  limit: number
  id: string
}): Promise<IReferredUserListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<IReferredUserListResponse>(
      `/user-affiliate/${id}/user-metrics`,
      { params }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get referred users')
  }
}
