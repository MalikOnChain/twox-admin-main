import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { Pagination, PaginationParams } from '@/types/common'
import {
  CryptoTransaction,
  GameTransaction,
  ServiceTransaction,
} from '@/types/transaction'

interface TransactionsParams extends PaginationParams {
  filters?: {
    type?: string
    search?: string
    method?: string
    currency?: string
    status?: string
    country?: string
  }
}

export interface TransactionsResponse {
  rows: GameTransaction[] | CryptoTransaction[] | ServiceTransaction[]
  pagination: Pagination
}
export const getTransactions = async ({
  page,
  limit,
  filters,
}: TransactionsParams): Promise<TransactionsResponse> => {
  const params: any = { page, limit }
  
  // Properly serialize filters object
  if (filters) {
    if (filters.type) {
      params['filters[type]'] = filters.type
    }
    if (filters.search) {
      params['filters[search]'] = filters.search
    }
    if (filters.method) {
      params['filters[method]'] = filters.method
    }
    if (filters.currency) {
      params['filters[currency]'] = filters.currency
    }
    if (filters.status) {
      params['filters[status]'] = filters.status
    }
    if (filters.country) {
      params['filters[country]'] = filters.country
    }
  }

  const response = await api.get(`/transactions`, { params })

  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response.data
}

export const getSeedData = async (params: { type: string }) => {
  const response = await api.get(`/transactions/seed`, { params })

  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response.data
}

export const approveWithdrawal = async (transactionId: string) => {
  try {
    const response = await api.post(`/transactions/approve-withdrawal`, {
      transactionId,
    })

    if (response.data.error) {
      throw new Error(response.data.error)
    }

    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to approve withdrawal')
  }
}

export interface TransactionChartsResponse {
  success: boolean
  data: {
    volume: {
      labels: string[]
      counts: number[]
      amounts: number[]
    }
    methodSplit: {
      labels: string[]
      counts: number[]
      amounts: number[]
    }
    processingTime: {
      labels: string[]
      counts: number[]
    }
  }
}

export const getTransactionCharts = async (params: {
  type: string
  days?: number
}): Promise<TransactionChartsResponse> => {
  const response = await api.get(`/transactions/charts`, { params })

  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response.data
}
