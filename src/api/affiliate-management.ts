import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IPartner {
  _id: string
  name: string
  code: string
  affeliosId?: string
  contactEmail?: string
  contactPhone?: string
  status: 'active' | 'inactive' | 'suspended'
  commissionRate: number
  dealType: 'revenue_share' | 'cpa' | 'hybrid'
  minPayout: number
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly'
  lastSyncAt?: string
  syncStatus?: 'success' | 'failed' | 'pending'
  metadata?: any
  createdAt?: string
  updatedAt?: string
}

export interface IDeal {
  _id: string
  partnerId: string | { _id: string; name: string; code: string }
  name: string
  description?: string
  dealType: 'revenue_share' | 'cpa' | 'hybrid'
  terms: {
    revenueShare?: { rate: number; cap?: number }
    cpa?: { amount: number; minDeposit?: number }
    hybrid?: { revenueShareRate: number; cpaAmount: number; threshold?: number }
  }
  validFrom: string
  validTo?: string
  status: 'active' | 'inactive' | 'expired'
  targetCountries?: string[]
  targetCurrencies?: string[]
  minDeposit?: number
  maxDeposit?: number
  createdAt?: string
  updatedAt?: string
}

export interface IPayout {
  _id: string
  partnerId: string | { _id: string; name: string; code: string }
  dealId?: string | { _id: string; name: string; dealType: string }
  period: {
    start: string
    end: string
  }
  amount: number
  currency: string
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  paidAt?: string
  paymentMethod?: string
  paymentReference?: string
  breakdown: {
    revenueShare?: number
    cpa?: number
    adjustments?: number
    deductions?: number
  }
  metrics: {
    ftds: number
    totalDeposits: number
    totalNGR: number
    totalGGR: number
    conversionRate?: number
    roi?: number
  }
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface IMiniAffiliate {
  _id: string
  userId: string | { _id: string; username: string; email?: string }
  referralCode: string
  status: 'active' | 'inactive' | 'suspended'
  commissionRate: number
  totalReferrals: number
  totalEarnings: number
  totalPaid: number
  pendingPayout: number
  lastPayoutAt?: string
  metadata?: any
  createdAt?: string
  updatedAt?: string
}

export interface IPartnerMetrics {
  ftds: Array<{ date: string; count: number; amount: number }>
  ngr: Array<{ date: string; ngr: number; totalBet: number; totalWin: number }>
  funnel: {
    totalRegistered: number
    totalDeposited: number
    totalDeposits: number
    totalDepositAmount: number
  }
  roi: number
  totalNGR: number
  totalFTDs: number
  totalFTDAmount: number
}

export const getPartners = async (params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): Promise<{
  success: boolean
  data: IPartner[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/affiliate-management/partners', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch partners')
    throw error
  }
}

export const getPartnerDetails = async (
  id: string,
  params?: { startDate?: string; endDate?: string }
): Promise<{ success: boolean; data: { partner: IPartner; metrics: IPartnerMetrics } }> => {
  try {
    const response = await api.get(`/affiliate-management/partners/${id}`, { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch partner details')
    throw error
  }
}

export const syncPartner = async (id: string): Promise<{ success: boolean; message: string; data: IPartner }> => {
  try {
    const response = await api.post(`/affiliate-management/partners/${id}/sync`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to sync partner')
    throw error
  }
}

export const getDeals = async (params?: {
  page?: number
  limit?: number
  partnerId?: string
  status?: string
}): Promise<{
  success: boolean
  data: IDeal[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/affiliate-management/deals', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch deals')
    throw error
  }
}

export const getPayouts = async (params?: {
  page?: number
  limit?: number
  partnerId?: string
  status?: string
  startDate?: string
  endDate?: string
}): Promise<{
  success: boolean
  data: IPayout[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/affiliate-management/payouts', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch payouts')
    throw error
  }
}

export const overridePayout = async (
  id: string,
  data: { amount: number; notes?: string }
): Promise<{ success: boolean; message: string; data: IPayout }> => {
  try {
    const response = await api.put(`/affiliate-management/payouts/${id}/override`, data)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to override payout')
    throw error
  }
}

export const getMiniAffiliates = async (params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): Promise<{
  success: boolean
  data: IMiniAffiliate[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/affiliate-management/mini-affiliates', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch mini-affiliates')
    throw error
  }
}

export const getNGRByPartner = async (params?: {
  startDate?: string
  endDate?: string
}): Promise<{ success: boolean; data: Array<{ partner: string; partnerCode: string; ngr: number }> }> => {
  try {
    const response = await api.get('/affiliate-management/analytics/ngr-by-partner', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch NGR by partner')
    throw error
  }
}

export const getConversionFunnel = async (params?: {
  startDate?: string
  endDate?: string
  partnerId?: string
}): Promise<{
  success: boolean
  data: {
    visitors: number
    registered: number
    deposited: number
    ftds: number
  }
}> => {
  try {
    const response = await api.get('/affiliate-management/analytics/conversion-funnel', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch conversion funnel')
    throw error
  }
}

export const getROI = async (params?: {
  startDate?: string
  endDate?: string
  partnerId?: string
}): Promise<{
  success: boolean
  data: Array<{ date: string; cost: number; revenue: number; roi: number }>
}> => {
  try {
    const response = await api.get('/affiliate-management/analytics/roi', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch ROI')
    throw error
  }
}

