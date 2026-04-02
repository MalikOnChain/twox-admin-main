import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IBonusOverview {
  activeBonuses: number
  valueIssued: number
  claimed: number
  costPercentOfGGR: number
}

export interface IBonusTypePerformance {
  type: string
  totalAmount: number
  claimCount: number
  uniqueUsers: number
}

export interface IClaimTrend {
  date: string
  claimCount: number
  totalAmount: number
}

export interface ICostVsNGR {
  date: string
  cost: number
  ngr: number
}

export interface IRegionSplit {
  region: string
  totalAmount: number
  claimCount: number
}

export const getBonusOverview = async (
  days?: number
): Promise<{ success: boolean; data: IBonusOverview }> => {
  try {
    const response = await api.get<{ success: boolean; data: IBonusOverview }>(
      '/bonuses-loyalty/overview',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch bonus overview')
    throw error
  }
}

export const getBonusTypePerformance = async (
  days?: number
): Promise<{ success: boolean; data: IBonusTypePerformance[] }> => {
  try {
    const response = await api.get<{ success: boolean; data: IBonusTypePerformance[] }>(
      '/bonuses-loyalty/overview/type-performance',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch bonus type performance')
    throw error
  }
}

export const getClaimTrend = async (
  days?: number
): Promise<{ success: boolean; data: IClaimTrend[] }> => {
  try {
    const response = await api.get<{ success: boolean; data: IClaimTrend[] }>(
      '/bonuses-loyalty/overview/claim-trend',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch claim trend')
    throw error
  }
}

export const getCostVsNGR = async (
  days?: number
): Promise<{ success: boolean; data: ICostVsNGR[] }> => {
  try {
    const response = await api.get<{ success: boolean; data: ICostVsNGR[] }>(
      '/bonuses-loyalty/overview/cost-vs-ngr',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch cost vs NGR')
    throw error
  }
}

export const getRegionSplit = async (
  days?: number
): Promise<{ success: boolean; data: IRegionSplit[] }> => {
  try {
    const response = await api.get<{ success: boolean; data: IRegionSplit[] }>(
      '/bonuses-loyalty/overview/region-split',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch region split')
    throw error
  }
}

