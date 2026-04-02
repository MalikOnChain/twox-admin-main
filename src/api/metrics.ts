import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { GetFtdTransactionsResponse } from '@/types/ftd'
import {
  IAnalytics,
  IConversionRates,
  IMainGGRStats,
  IMetrics,
} from '@/types/metrics'

export const getMetrics = async (): Promise<IMetrics> => {
  try {
    const response = await api.get('/metrics/metrics')
    return response.data.rows
  } catch (error) {
    handleApiError(error, 'Failed to get metrics')
  }
}

export const getMainGGRStats = async (payload: {
  startDate: string
  endDate: string
}): Promise<IMainGGRStats> => {
  try {
    const response = await api.get('/metrics/ggr', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get ggr')
  }
}

export const getAnalytics = async (): Promise<IAnalytics[]> => {
  try {
    const response = await api.get('/metrics/analytics')
    return response.data.rows
  } catch (error) {
    handleApiError(error, 'Failed to get analytics')
  }
}

export const getConversionRates = async (): Promise<IConversionRates> => {
  try {
    const response = await api.get('/metrics/conversion-rates')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get conversion rates')
  }
}

interface IFtdSummaryPayload {
  startDate: string
  endDate: string
}

export const getFtdSummary = async (
  payload: IFtdSummaryPayload
): Promise<any> => {
  try {
    const response = await api.get('/metrics/ftd-metrics', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get ftd summary')
  }
}

interface IFtdBreakDownPayload {
  page: number
  limit: number
  startDate: string
  endDate: string
}

export const getFtdTransactions = async ({
  page,
  limit,
  startDate,
  endDate,
}: IFtdBreakDownPayload): Promise<GetFtdTransactionsResponse> => {
  try {
    const response = await api.get('/metrics/ftd-transactions', {
      params: { page, limit, startDate, endDate },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get ftd transactions')
  }
}

interface IConversionFunnelPayload {
  startDate: string
  endDate: string
}

export interface IConversionFunnel {
  visitors: number
  registrations: number
  deposits: number
}

export const getConversionFunnel = async (
  payload: IConversionFunnelPayload
): Promise<IConversionFunnel> => {
  try {
    const response = await api.get('/metrics/conversion-funnel', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get conversion funnel')
  }
}

interface IGGRvsNGRPayload {
  startDate: string
  endDate: string
}

export interface IGGRvsNGR {
  dates: string[]
  ggr: number[]
  ngr: number[]
}

export const getGGRvsNGR = async (payload: IGGRvsNGRPayload): Promise<IGGRvsNGR> => {
  try {
    const response = await api.get('/metrics/ggr-vs-ngr', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get GGR vs NGR')
  }
}

interface ITopGamesPayload {
  startDate: string
  endDate: string
  limit?: number
}

export interface ITopGame {
  gameId: string
  gameName: string
  providerName: string
  totalBetAmount: number
  totalWinAmount: number
  transactionCount: number
}

export interface ITopGames {
  games: ITopGame[]
}

export const getTopGames = async (payload: ITopGamesPayload): Promise<ITopGames> => {
  try {
    const response = await api.get('/metrics/top-games', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get top games')
  }
}

interface IProviderUptimePayload {
  startDate: string
  endDate: string
}

export interface IProviderUptimeData {
  provider: string
  providerName: string
  data: { date: string; uptime: number; transactionCount: number }[]
}

export interface IProviderUptime {
  dates: string[]
  providers: IProviderUptimeData[]
}

export const getProviderUptime = async (
  payload: IProviderUptimePayload
): Promise<IProviderUptime> => {
  try {
    const response = await api.get('/metrics/provider-uptime', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get provider uptime')
  }
}

interface IRecentBigWinsPayload {
  limit?: number
  minWinAmount?: number
}

export interface IBigWin {
  _id: string
  gameId: string
  gameName: string
  provider: string
  providerCode: string
  category: string
  userId: string
  username: string
  email: string
  betAmount: number
  winAmount: number
  profit: number
  multiplier: number
  createdAt: string
  userBalanceBefore: number
  userBalanceAfter: number
}

export interface IRecentBigWins {
  success: boolean
  data: IBigWin[]
  total: number
}

export const getRecentBigWins = async (
  payload?: IRecentBigWinsPayload
): Promise<IRecentBigWins> => {
  try {
    const response = await api.get('/metrics/recent-big-wins', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get recent big wins')
  }
}

interface IPlatformFeesWidgetPayload {
  startDate: string
  endDate: string
  threshold?: number
}

export interface IPlatformFeesWidget {
  success: boolean
  data: {
    totalFees: number
    fiatFees: number
    cryptoFees: number
    fiatTransactionCount: number
    cryptoTransactionCount: number
    threshold: number
    isOverThreshold: boolean
  }
}

export const getPlatformFeesWidget = async (
  payload: IPlatformFeesWidgetPayload
): Promise<IPlatformFeesWidget> => {
  try {
    const response = await api.get('/metrics/platform-fees-widget', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get platform fees widget')
  }
}

export interface ISystemHealth {
  success: boolean
  data: {
    apiLatency: {
      average: number
      status: 'healthy' | 'warning' | 'critical'
      unit: string
    }
    providers: Array<{
      provider: string
      status: 'healthy' | 'error' | 'inactive'
      errorCount: number
      lastError: string | null
    }>
    totalErrors: number
  }
}

export const getSystemHealth = async (): Promise<ISystemHealth> => {
  try {
    const response = await api.get('/metrics/system-health')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get system health')
  }
}

interface ILiveActivityPayload {
  limit?: number
  since?: string
}

export interface ILiveActivity {
  success: boolean
  data: Array<{
    type: 'bet' | 'deposit' | 'win'
    id: string
    userId: string
    username: string
    amount: number
    gameId?: string
    gameName?: string
    timestamp: string
  }>
  timestamp: string
}

export const getLiveActivity = async (
  payload?: ILiveActivityPayload
): Promise<ILiveActivity> => {
  try {
    const response = await api.get('/metrics/live-activity', { params: payload })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get live activity')
  }
}
