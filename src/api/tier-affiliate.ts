import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { IAffiliateMetrics, IReferredUserListResponse } from '@/types/affiliate'
import {
  IAssigner,
  ITierAffiliate,
  ITierAffiliateCollection,
  ITierAffiliateListResponse,
} from '@/types/tier-affiliate'

export const getAllTierAffiliates = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<ITierAffiliateListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<ITierAffiliateListResponse>(
      '/tier-affiliate',
      { params }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get all tier affiliates')
  }
}

export const getTierAffiliateById = async (
  id: string
): Promise<ITierAffiliateCollection> => {
  try {
    const response = await api.get<ITierAffiliateCollection>(
      `/tier-affiliate/${id}`
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get tier affiliate by id')
  }
}

export const createTierAffiliate = async (
  tierAffiliateData: ITierAffiliate
): Promise<ITierAffiliate> => {
  try {
    const response = await api.post<ITierAffiliate>(
      '/tier-affiliate',
      tierAffiliateData
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create tier affiliate')
  }
}

export const updateTierAffiliate = async (
  id: string,
  tierAffiliateData: Partial<ITierAffiliate>
): Promise<ITierAffiliate> => {
  try {
    const response = await api.put<ITierAffiliate>(
      `/tier-affiliate/${id}`,
      tierAffiliateData
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update tier affiliate')
  }
}

export const deleteTierAffiliate = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/tier-affiliate/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete tier affiliate')
  }
}

export const getAssigners = async (id?: string): Promise<IAssigner[]> => {
  try {
    const response = await api.get<IAssigner[]>(
      `/tier-affiliate/streamers${id ? `?id=${id}` : ''}`
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get assigners')
  }
}

export const generateReferralCode = async (): Promise<string> => {
  try {
    const response = await api.get<string>('/tier-affiliate/referral-code')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to generate referral code')
  }
}

export const getMetricsByTier = async ({ id }: { id: string }) => {
  try {
    const response = await api.get<IAffiliateMetrics>(
      `/tier-affiliate/${id}/metrics`
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get metrics by tier')
  }
}

export const getReferredUsersByTier = async ({
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
      `/tier-affiliate/${id}/user-metrics`,
      { params }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get referred users')
  }
}
