import api from '@/lib/api' // Assuming you have an api instance setup
import { handleApiError } from '@/lib/error'

import {
  Bonus,
  BonusDetailResponse,
  BonusListResponse,
  BonusSuccessResponse,
  IBonusEligibility,
  IBonusSettings,
  IBonusTierRewards,
} from '@/types/bonus'

interface UpdateBonusResponse {
  success: boolean
  bonus: Bonus
  eligibility: IBonusEligibility
  settings: IBonusSettings
  tierRewards: IBonusTierRewards[]
}

interface CreateBonusResponse {
  success: boolean
  bonus: Bonus
}

/**
 * Create a new bonus
 * @param bonus The bonus data to create
 * @returns The created bonus data
 */
export const createBonus = async (
  bonusData: any,
  configuration: {
    eligibility: any
    settings: any
    tierRewards: any
  }
): Promise<CreateBonusResponse> => {
  try {
    const res = await api.post<CreateBonusResponse>('/bonus', {
      bonusData,
      configuration,
    })

    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create bonus')
  }
}

export const updateBonus = async (
  id: string,
  bonusData: any,
  configuration: {
    eligibility: any
    settings: any
    tierRewards: any
  }
): Promise<UpdateBonusResponse> => {
  try {
    const res = await api.put<UpdateBonusResponse>(`/bonus/${id}`, {
      bonusData,
      configuration,
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update bonus')
  }
}

export const getBonuses = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: any
}): Promise<BonusListResponse> => {
  try {
    const res = await api.get<BonusListResponse>('/bonus', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get bonuses')
  }
}

export const getBonusDetail = async (
  id: string
): Promise<BonusDetailResponse> => {
  try {
    const res = await api.get<BonusDetailResponse>(`/bonus/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get bonus')
  }
}

export const deleteBonus = async (
  id: string
): Promise<BonusSuccessResponse> => {
  try {
    const res = await api.delete<BonusSuccessResponse>(`/bonus/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete bonus')
  }
}

interface BonusImageResponse {
  success: boolean
  url: string
  message?: string
}

export const uploadBonusImage = async (formData: FormData): Promise<BonusImageResponse> => {
  try {
    const response = await api.post<BonusImageResponse>(
      '/bonus/update-image',
      formData
    )
    return response.data
  } catch (error: any) {
    console.error('Bonus image upload error:', error)
    console.error('Error response:', error?.response?.data)
    const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to upload bonus image'
    handleApiError(error, errorMessage)
    throw error
  }
}
