import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IRedemptionTrend {
  date: string
  count: number
  amount: number
}

export interface IROIByType {
  type: string
  cost: number
  ggr: number
  roi: number
  count: number
}

export interface ILiabilityVsSettled {
  liability: {
    active: number
    lockedWinnings: number
    total: number
    count: number
  }
  settled: {
    total: number
    forfeited: number
    net: number
    count: number
  }
}

export interface IPlayerPerformance {
  _id: string
  userId: string
  username: string
  email?: string
  bonusId: string
  bonusName: string
  bonusType: string
  initialAmount: number
  bonusBalance: number
  lockedWinnings: number
  wageringProgress: number
  status: string
  claimedAt?: string
  createdAt: string
  ggr: number
  roi: number
}

export const getRedemptionTrend = async (params?: {
  days?: number
}): Promise<{ success: boolean; data: IRedemptionTrend[] }> => {
  try {
    const response = await api.get('/bonuses-loyalty/performance/redemption-trend', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch redemption trend')
    throw error
  }
}

export const getROIByType = async (params?: {
  days?: number
}): Promise<{ success: boolean; data: IROIByType[] }> => {
  try {
    const response = await api.get('/bonuses-loyalty/performance/roi-by-type', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch ROI by type')
    throw error
  }
}

export const getLiabilityVsSettled = async (): Promise<{
  success: boolean
  data: ILiabilityVsSettled
}> => {
  try {
    const response = await api.get('/bonuses-loyalty/performance/liability-vs-settled')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch liability vs settled')
    throw error
  }
}

export const getPlayerPerformance = async (params?: {
  page?: number
  limit?: number
  search?: string
  bonusType?: string
  status?: string
}): Promise<{
  success: boolean
  data: IPlayerPerformance[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/bonuses-loyalty/performance/player-performance', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch player performance')
    throw error
  }
}

export const adjustBonus = async (
  id: string,
  data: {
    action: 'forfeit' | 'convert' | 'extend'
    amount?: number
    expiryDate?: string
    notes?: string
  }
): Promise<{ success: boolean; data: any; message: string }> => {
  try {
    const response = await api.put(`/bonuses-loyalty/performance/adjust/${id}`, data)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to adjust bonus')
    throw error
  }
}

