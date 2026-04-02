import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

// Player List
export interface IPlayerListFilters {
  page?: number
  limit?: number
  country?: string
  vip?: string
  kyc?: string
  risk?: string
  balanceMin?: number
  balanceMax?: number
  status?: string
  joinDateFrom?: string
  joinDateTo?: string
  search?: string
}

export interface IPlayer {
  _id: string
  username: string
  email: string
  avatar?: string
  country: string
  countryCode?: string
  cash: number
  bonus: number
  kycTier: string
  vip: string
  risk: string
  status: string
  lastLogin: string | null
  isBanned: boolean
  lock_bet: boolean
  lock_transaction: boolean
}

export interface IPlayerListResponse {
  success: boolean
  data: IPlayer[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
  charts: {
    retention: Array<{
      period: string
      newUsers: number
      returningUsers: number
      retentionRate: number
    }>
    topCountries: Array<{
      country: string
      count: number
    }>
  }
}

export const getPlayerList = async (
  filters: IPlayerListFilters
): Promise<IPlayerListResponse> => {
  try {
    const response = await api.get('/user-management/player-list', { params: filters })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get player list')
  }
}

// Player Profile
export interface IPlayerProfile {
  success: boolean
  data: {
    user: any
    vip: any
    kyc: any[]
    transactions: {
      pix: any[]
      crypto: any[]
    }
    bets: any[]
    bonuses: any[]
    sessions: any[]
    referrals: {
      referrals: any[]
      totalEarnings: number
    }
    risk: {
      score: number
      level: string
      factors: any
    }
    balances: {
      cash: number
      bonus: number
      total: number
    }
    vipProgress: any
    loginInfo: {
      lastLogin: {
        ipAddress: string
        userAgent: string
        device: string
        location: string
        country: string
        countryCode: string | null
        region: string
        city: string
        zip: string
        timezone: string
        isp: string
        loginTime: string
      } | null
      firstLogin: {
        ipAddress: string
        location: string
        loginTime: string
      } | null
      totalLogins: number
    }
  }
}

export const getPlayerProfile = async (userId: string): Promise<IPlayerProfile> => {
  try {
    const response = await api.get(`/user-management/player-profile/${userId}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get player profile')
  }
}

// KYC Shortcut
export interface IKYCShortcut {
  _id: string
  userId: string
  status: string
  adminReview: {
    status: string
    reviewedAt?: string
    notes?: string
  }
  reviewResult?: any
  sla: {
    hoursRemaining: number
    isOverSLA: boolean
    hoursElapsed: number
  }
  user?: {
    username: string
    email: string
  }
  createdAt: string
}

export interface IKYCShortcutResponse {
  success: boolean
  data: IKYCShortcut[]
}

export const getKYCShortcut = async (params?: {
  userId?: string
  status?: string
}): Promise<IKYCShortcutResponse> => {
  try {
    const response = await api.get('/user-management/kyc-shortcut', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get KYC shortcut')
  }
}

export const updateKYCStatus = async (
  kycId: string,
  status: 'approved' | 'rejected',
  reason?: string
): Promise<any> => {
  try {
    const response = await api.put(`/user-management/kyc-shortcut/${kycId}`, {
      status,
      reason,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update KYC status')
  }
}

// Bonuses in Profile
export interface IBonusInProfile {
  _id: string
  bonusId: any
  bonusBalance: number
  lockedWinnings: number
  initialAmount: number
  wageringProgress: number
  wageringMultiplier: number
  status: string
  progress: number
  remainingWager: number
  expiresAt?: string
  userId?: string
  user?: {
    _id: string
    username?: string
    email?: string
    avatar?: string
  }
}

export interface IBonusesInProfileResponse {
  success: boolean
  data: IBonusInProfile[]
  user?: {
    _id: string
    username?: string
    email?: string
    avatar?: string
  }
  pagination?: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
}

export const getBonusesInProfile = async ({
  userId,
  status,
  page,
  limit,
  search,
}: {
  userId?: string
  status?: string
  page?: number
  limit?: number
  search?: string
}): Promise<IBonusesInProfileResponse> => {
  try {
    const url = userId
      ? `/user-management/bonuses-in-profile/${userId}`
      : `/user-management/bonuses-in-profile`
    const response = await api.get(url, {
      params: { status, page, limit, search },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get bonuses in profile')
  }
}

// VIP Manager
export interface IVIPTier {
  _id: string
  name: string
  icon: string
  levels: Array<{
    name: string
    level: number
    minXP: number
    icon: string
  }>
  userCount: number
  users: number
}

export interface IVIPManagerResponse {
  success: boolean
  data: {
    tiers: IVIPTier[]
    migration: Array<{
      tier: string
      count: number
    }>
  }
}

export const getVIPManager = async (): Promise<IVIPManagerResponse> => {
  try {
    const response = await api.get('/user-management/vip-manager')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get VIP manager data')
  }
}

// Engagement & Play-Time
export interface IEngagementData {
  success: boolean
  data: {
    cards: {
      totalPlayTime: number
      avgSessionLength: number
      sessionsThisWeek: number
      lastSession: string | null
    }
    charts: {
      sessionLengthTrend: Array<{
        date: string
        avgLength: number
        count: number
      }>
      distribution: Array<{
        range: string
        count: number
      }>
      timeByGame: Array<{
        gameId: string
        gameName: string
        time: number
      }>
    }
  }
}

export const getEngagementData = async (
  userId?: string,
  days?: number
): Promise<IEngagementData> => {
  try {
    const url = userId
      ? `/user-management/engagement/${userId}`
      : `/user-management/engagement`
    const response = await api.get(url, {
      params: { days },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get engagement data')
  }
}

export interface IEngagementUser {
  _id: string
  username: string
  email: string
  avatar: string
  totalPlayTime: number
  avgSessionLength: number
  sessionsThisWeek: number
  lastSession: string | null
  totalSessions: number
}

export interface IEngagementUsersListResponse {
  success: boolean
  data: IEngagementUser[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
}

export const getEngagementUsersList = async (
  page?: number,
  limit?: number,
  days?: number
): Promise<IEngagementUsersListResponse> => {
  try {
    const response = await api.get('/user-management/engagement/users', {
      params: { page, limit, days },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get engagement users list')
  }
}

// Streamer/Influencer Accounts
export interface IStreamerAccount {
  _id: string
  username: string
  email: string
  avatar: string
  createdAt: string
  balance?: number
  streamerSettings?: {
    status?: 'active' | 'paused'
    budget?: number
    override?: {
      rtp?: number
      startDate?: string
      endDate?: string
      notes?: string
    }
    campaign?: {
      name?: string
      link?: string
      budget?: number
      assignedAt?: string
    }
    lastNotes?: string
    lastUpdatedAt?: string
    lastAction?: string
  }
  performance: {
    clicks: number
    signups: number
    ftds: number
    revenue: number
  }
}

export interface IStreamerAccountsResponse {
  success: boolean
  data: IStreamerAccount[]
}

export const getStreamerAccounts = async (): Promise<IStreamerAccountsResponse> => {
  try {
    const response = await api.get('/user-management/streamer-accounts')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get streamer accounts')
  }
}

export const addStreamerFunds = async (
  streamerId: string,
  payload: { amount: number; notes?: string }
) => {
  try {
    const response = await api.post(`/user-management/streamer-accounts/${streamerId}/funds`, payload)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to grant streamer funds')
  }
}

export const setStreamerOverride = async (
  streamerId: string,
  payload: { rtp: number; startDate?: string; endDate?: string; notes?: string }
) => {
  try {
    const response = await api.post(
      `/user-management/streamer-accounts/${streamerId}/override`,
      payload
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to set streamer override')
  }
}

export const assignStreamerCampaign = async (
  streamerId: string,
  payload: { campaignName: string; campaignLink?: string; campaignBudget?: number }
) => {
  try {
    const response = await api.post(
      `/user-management/streamer-accounts/${streamerId}/campaign`,
      payload
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to assign campaign')
  }
}

export const updateStreamerStatus = async (
  streamerId: string,
  payload: { status: 'active' | 'paused'; notes?: string }
) => {
  try {
    const response = await api.post(
      `/user-management/streamer-accounts/${streamerId}/status`,
      payload
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update streamer status')
  }
}

// Bot Accounts
export interface IBotAccount {
  _id: string
  username: string
  avatar: string
  wager: number
  rank: string
  maxMultiplier: number
  minMultiplier: number
  maxBet: number
  minBet: number
  status?: string
  stats: {
    bets: number
    transactions: number
    balance: number
  }
}

export interface IBotAccountsResponse {
  success: boolean
  data: IBotAccount[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
}

export const getBotAccounts = async (params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<IBotAccountsResponse> => {
  try {
    const response = await api.get('/user-management/bot-accounts', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get bot accounts')
  }
}

export const createBotAccount = async (payload: {
  username: string
  avatar?: string
  wager: number
  rank: string
  minBet: number
  maxBet: number
  minMultiplier: number
  maxMultiplier: number
}) => {
  try {
    const response = await api.post('/user-management/bot-accounts', payload)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create bot account')
  }
}

export interface IBotStatsResponse {
  success: boolean
  data: {
    labels: string[]
    bets: number[]
    wagers: number[]
  }
}

export const getBotStats = async (days?: number): Promise<IBotStatsResponse> => {
  try {
    const response = await api.get('/user-management/bot-accounts/stats', {
      params: { days },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get bot stats')
  }
}

