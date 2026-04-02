import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface ISegmentationUser {
  _id: string
  username: string
  email?: string
  country: string
  countryCode?: string
  vip: string
  risk: 'low' | 'medium' | 'high'
  currency: string
  balance: number
  bonusBalance: number
  depositFrequency: number
  providers: string[]
  categories: string[]
  kycStatus: string
  lastLogin?: string
  createdAt: string
}

export interface ISegmentationStats {
  totalUsers: number
  totalBalance: number
  averageBalance: number
  totalBonusBalance: number
  averageDepositFrequency: number
  byCountry: Array<{ name: string; count: number }>
  byVIP: Array<{ name: string; count: number }>
  byRisk: Array<{ name: string; count: number }>
}

export interface IFilterOptions {
  countries: Array<{ name: string; code?: string; count: number }>
  vipTiers: Array<{ name: string; count: number }>
  providers: Array<{ name: string; count: number }>
  categories: Array<{ name: string }>
  riskLevels: Array<{ name: string; label: string }>
  depositFrequencies: Array<{ name: string; label: string }>
}

export interface ISegmentationResponse {
  success: boolean
  data: ISegmentationUser[]
  stats: ISegmentationStats
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export const getSegmentation = async (params?: {
  country?: string
  vip?: string
  risk?: string
  currency?: string
  provider?: string
  gameCategory?: string
  minBalance?: number
  maxBalance?: number
  depositFrequency?: string
  page?: number
  limit?: number
}): Promise<ISegmentationResponse> => {
  try {
    const response = await api.get('/bonus-segmentation/segmentation', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch segmentation data')
    throw error
  }
}

export const getFilterOptions = async (): Promise<{
  success: boolean
  data: IFilterOptions
}> => {
  try {
    const response = await api.get('/bonus-segmentation/segmentation/filter-options')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch filter options')
    throw error
  }
}

