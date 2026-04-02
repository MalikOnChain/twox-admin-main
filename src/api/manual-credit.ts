import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface ICreditTransaction {
  _id: string
  userId: string | { _id: string; username: string; email?: string }
  type: string
  amount: number
  userBalance: {
    before: number
    after: number
  }
  status: string
  metadata?: {
    reason?: string
    tag?: string
    expiryDate?: string
    wageringMultiplier?: number
    notes?: string
    issuedBy?: string
    issuedAt?: string
  }
  createdAt: string
  updatedAt: string
}

export interface ICreditStats {
  byTag: Array<{
    tag: string
    amount: number
    count: number
  }>
  total: number
  count: number
}

export interface IIssueCreditData {
  userId: string
  amount: number
  reason: string
  tag: 'bonus' | 'comp' | 'maintenance'
  expiryDate?: string
  wageringMultiplier?: number
  notes?: string
}

export const issueCredit = async (
  data: IIssueCreditData
): Promise<{ success: boolean; data: any; message: string }> => {
  try {
    const response = await api.post('/bonuses-loyalty/manual-credit/issue', data)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to issue credit')
    throw error
  }
}

export const getCreditLedger = async (params?: {
  page?: number
  limit?: number
  userId?: string
  tag?: string
  startDate?: string
  endDate?: string
}): Promise<{
  success: boolean
  data: ICreditTransaction[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/bonuses-loyalty/manual-credit/ledger', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch credit ledger')
    throw error
  }
}

export const getCreditStats = async (params?: {
  days?: number
}): Promise<{ success: boolean; data: ICreditStats }> => {
  try {
    const response = await api.get('/bonuses-loyalty/manual-credit/stats', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch credit stats')
    throw error
  }
}

