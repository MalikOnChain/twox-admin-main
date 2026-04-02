import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IWalletBalance {
  currency: string
  amount: number
  addressCount?: number
}

export interface IWalletBalancesResponse {
  success: boolean
  data: {
    hot: IWalletBalance[]
    warm: IWalletBalance[]
    cold: IWalletBalance[]
    fiat: {
      BRL: {
        totalUserBalance: number
        pendingDeposits: number
        pendingWithdrawals: number
      }
    }
    crypto: Array<{
      currency: string
      totalAmount: number
      depositAmount?: number
      withdrawalAmount?: number
    }>
  }
}

export interface ILiquidityTrendResponse {
  success: boolean
  data: {
    labels: string[]
    deposits: number[]
    withdrawals: number[]
    netLiquidity: number[]
  }
}

export interface ICurrencyExposureResponse {
  success: boolean
  data: {
    exposure: Array<{
      currency: string
      amount: number
      percentage: number
      breakdown: {
        hot: number
        warm: number
        cold: number
        fiat: number
      }
    }>
    total: number
  }
}

export interface ITransferRequest {
  fromAddress: string
  toAddress: string
  blockchain: string
  amount: number
  unit: string
  note?: string
}

export interface ISettlementReportResponse {
  success: boolean
  data: {
    period: {
      start: string
      end: string
    }
    walletBalances: any
    transactions: {
      fiat: any[]
      crypto: any[]
    }
    generatedAt: string
  }
}

export const getWalletBalances = async (): Promise<IWalletBalancesResponse> => {
  try {
    const response = await api.get('/treasury/wallets')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch wallet balances')
    throw error
  }
}

export const getLiquidityTrend = async (days?: number): Promise<ILiquidityTrendResponse> => {
  try {
    const response = await api.get('/treasury/liquidity-trend', {
      params: { days },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch liquidity trend')
    throw error
  }
}

export const getCurrencyExposure = async (): Promise<ICurrencyExposureResponse> => {
  try {
    const response = await api.get('/treasury/currency-exposure')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch currency exposure')
    throw error
  }
}

export const initiateTransfer = async (transferData: ITransferRequest) => {
  try {
    const response = await api.post('/treasury/transfer', transferData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to initiate transfer')
    throw error
  }
}

export const generateSettlementReport = async (startDate?: string, endDate?: string): Promise<ISettlementReportResponse> => {
  try {
    const response = await api.get('/treasury/settlement-report', {
      params: { startDate, endDate },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to generate settlement report')
    throw error
  }
}

