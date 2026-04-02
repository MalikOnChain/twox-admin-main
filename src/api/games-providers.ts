import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IGame {
  _id: string
  name: string
  gameId: string
  provider: string
  providerName: string
  rtp: string
  bets24h: number
  ggr: number
  hold: number
  status: string
  isEnabled: boolean
  image: string
}

export interface IGameDetail {
  game: IGame
  financial: {
    totalStakes: number
    totalWins: number
    totalGGR: number
    transactionCount: number
  }
  rtpTrend: Array<{
    date: string
    rtp: number
  }>
  betHistogram: Array<{
    range: string
    count: number
  }>
  regionSplit: Array<{
    region: string
    bets: number
    wins: number
    count: number
    ggr: number
  }>
}

export interface IProvider {
  _id: string
  code: string
  name: string
  image: string
  gamesCount: number
  uptimePercent: number
  feePercent: number
  markets: string[]
  ggr: number
  totalBets: number
  totalWins: number
  uniqueUsers: number
}

export interface IProviderAnalytics {
  ggrShare: Array<{
    provider: string
    code: string
    ggr: number
    percentage: number
  }>
  uptimeTrend: Array<{
    provider: string
    code: string
    uptime: Array<{
      date: string
      uptime: number
    }>
  }>
}

export interface IAnalytics {
  topGames: Array<{
    gameId: string
    name: string
    provider: string
    providerName: string
    ggr: number
    totalBets: number
    totalWins: number
    transactionCount: number
    actualRTP: number
    expectedRTP: number
    rtpDeviation: number
  }>
  providerComparison: Array<{
    provider: string
    code: string
    ggr: number
    totalBets: number
    totalWins: number
    transactionCount: number
    uniqueUsers: number
    rtp: number
  }>
  rtpDeviation: Array<{
    gameId: string
    name: string
    provider: string
    expectedRTP: number
    actualRTP: number
    deviation: number
    deviationPercent: number
  }>
}

export interface IGamesListResponse {
  success: boolean
  data: IGame[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export const getGamesList = async (params?: {
  page?: number
  limit?: number
  search?: string
  provider?: string
  status?: string
}): Promise<IGamesListResponse> => {
  try {
    const response = await api.get<IGamesListResponse>('/games-providers/games', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch games list')
    throw error
  }
}

export const getGameDetail = async (
  gameId: string,
  days?: number
): Promise<{ success: boolean; data: IGameDetail }> => {
  try {
    const response = await api.get<{ success: boolean; data: IGameDetail }>(
      `/games-providers/games/${gameId}`,
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch game detail')
    throw error
  }
}

export const updateGameStatus = async (
  gameId: string,
  data: { isEnabled?: boolean; status?: string }
): Promise<{ success: boolean; data: IGame }> => {
  try {
    const response = await api.put<{ success: boolean; data: IGame }>(
      `/games-providers/games/${gameId}/status`,
      data
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update game status')
    throw error
  }
}

export interface IProvidersListResponse {
  success: boolean
  data: IProvider[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export const getProvidersList = async (params?: {
  page?: number
  limit?: number
  search?: string
  code?: string
}): Promise<IProvidersListResponse> => {
  try {
    const response = await api.get<IProvidersListResponse>(
      '/games-providers/providers',
      { params }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch providers list')
    throw error
  }
}

export const getProviderAnalytics = async (
  days?: number
): Promise<{ success: boolean; data: IProviderAnalytics }> => {
  try {
    const response = await api.get<{ success: boolean; data: IProviderAnalytics }>(
      '/games-providers/providers/analytics',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch provider analytics')
    throw error
  }
}

export interface IProvidersSummary {
  totalProviders: number
  totalGames: number
}

export const getProvidersSummary = async (): Promise<{
  success: boolean
  data: IProvidersSummary
}> => {
  try {
    const response = await api.get<{ success: boolean; data: IProvidersSummary }>(
      '/games-providers/providers/summary'
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch providers summary')
    throw error
  }
}

export const getAnalytics = async (
  days?: number,
  limit?: number
): Promise<{ success: boolean; data: IAnalytics }> => {
  try {
    const response = await api.get<{ success: boolean; data: IAnalytics }>(
      '/games-providers/analytics',
      { params: { days, limit } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch analytics')
    throw error
  }
}

export interface IProviderCatalogItem {
  provider: string
  code: string
  verticals: string[]
  status: string
  liveGames: number
  totalGames: number
  ggr: number
  feePercent: number
  totalBets: number
  totalWins: number
  transactionCount: number
}

export interface IProviderDetail {
  provider: string
  code: string
  apiVersion: string
  contract: string
  verticals: string[]
  markets: string[]
  feeModel: string
  feePercent: number
  ggrTrend: Array<{ date: string; ggr: number }>
  conversion: number
  totalGames: number
  enabledGames: number
}

export interface IVerticalManagerItem {
  vertical: string
  providers: string[]
  totalGames: number
  liability: number
  totalBets: number
  totalWins: number
  walletRules: string
  reportingSets: string
  failover: string
  versionTracking: string
}

export const getMultiProviderCatalog = async (
  days?: number
): Promise<{ success: boolean; data: IProviderCatalogItem[] }> => {
  try {
    const response = await api.get<{ success: boolean; data: IProviderCatalogItem[] }>(
      '/games-providers/multi-provider/catalog',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch multi-provider catalog')
    throw error
  }
}

export const getProviderDetail = async (
  providerCode: string,
  days?: number
): Promise<{ success: boolean; data: IProviderDetail }> => {
  try {
    const response = await api.get<{ success: boolean; data: IProviderDetail }>(
      `/games-providers/multi-provider/provider/${providerCode}`,
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch provider detail')
    throw error
  }
}

export const getVerticalManager = async (
  days?: number
): Promise<{ success: boolean; data: IVerticalManagerItem[] }> => {
  try {
    const response = await api.get<{ success: boolean; data: IVerticalManagerItem[] }>(
      '/games-providers/multi-provider/verticals',
      { params: { days } }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch vertical manager data')
    throw error
  }
}

