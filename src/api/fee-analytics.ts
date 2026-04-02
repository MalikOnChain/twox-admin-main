import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IFeeAnalyticsSummary {
  success: boolean
  data: {
    totalFees: number
    fiatFees: number
    cryptoFees: number
    avgFeePercent: number
    topCostlyMethod: string
    totalVolume: number
  }
}

export interface IFeesByMethod {
  success: boolean
  data: {
    labels: string[]
    fees: number[]
    volumes: number[]
  }
}

export interface IFeesByCurrency {
  success: boolean
  data: {
    labels: string[]
    fees: number[]
    volumes: number[]
  }
}

export interface IFeesVsVolume {
  success: boolean
  data: {
    labels: string[]
    volumes: number[]
    fees: number[]
  }
}

export interface IFeeBreakdownItem {
  method: string
  currency: string
  txCount: number
  volume: number
  fees: number
  feePercent: number
}

export interface IFeeBreakdown {
  success: boolean
  data: IFeeBreakdownItem[]
}

export interface IThresholdAlerts {
  success: boolean
  data: Array<{
    type: string
    method: string
    fees: number
    threshold: number
    message: string
  }>
}

export const getFeeAnalyticsSummary = async (
  startDate?: string,
  endDate?: string
): Promise<IFeeAnalyticsSummary> => {
  try {
    const response = await api.get('/fee-analytics/summary', {
      params: { startDate, endDate },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch fee analytics summary')
    throw error
  }
}

export const getFeesByMethod = async (
  startDate?: string,
  endDate?: string
): Promise<IFeesByMethod> => {
  try {
    const response = await api.get('/fee-analytics/by-method', {
      params: { startDate, endDate },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch fees by method')
    throw error
  }
}

export const getFeesByCurrency = async (
  startDate?: string,
  endDate?: string
): Promise<IFeesByCurrency> => {
  try {
    const response = await api.get('/fee-analytics/by-currency', {
      params: { startDate, endDate },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch fees by currency')
    throw error
  }
}

export const getFeesVsVolume = async (
  startDate?: string,
  endDate?: string,
  days?: number
): Promise<IFeesVsVolume> => {
  try {
    const response = await api.get('/fee-analytics/fees-vs-volume', {
      params: { startDate, endDate, days },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch fees vs volume')
    throw error
  }
}

export const getFeeBreakdown = async (
  startDate?: string,
  endDate?: string
): Promise<IFeeBreakdown> => {
  try {
    const response = await api.get('/fee-analytics/breakdown', {
      params: { startDate, endDate },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch fee breakdown')
    throw error
  }
}

export const getThresholdAlerts = async (threshold?: number): Promise<IThresholdAlerts> => {
  try {
    const response = await api.get('/fee-analytics/threshold-alerts', {
      params: { threshold },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch threshold alerts')
    throw error
  }
}

