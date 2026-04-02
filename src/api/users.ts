import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { Pagination, PaginationParams } from '@/types/common'
import {
  CryptoTransaction,
  GameTransaction,
  ServiceTransaction,
} from '@/types/transaction'
import { IUsersListResponse } from '@/types/users'

interface APICommonResponse {
  success: boolean
  message: string
  error?: any
  data?: any
  rows?: any[]
  total?: number
  row?: any
}

export const getUsers = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: string
}): Promise<IUsersListResponse> => {
  try {
    const response = await api.post<IUsersListResponse>('/user/list', {
      page,
      limit,
      filter,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get users')
  }
}

export const getUserById = async ({
  id,
}: {
  id: string
}): Promise<APICommonResponse> => {
  try {
    const response = await api.get<APICommonResponse>(`/user/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get user by id')
  }
}

export const lockBetUser = async ({
  id,
  lock,
}: {
  id: string
  lock: boolean
}): Promise<APICommonResponse> => {
  try {
    const response = await api.post<APICommonResponse>(`/user/lock-bet`, {
      id,
      isLocked: lock,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to lock bet user')
  }
}

export const lockTransactionUser = async ({
  id,
  lock,
}: {
  id: string
  lock: boolean
}): Promise<APICommonResponse> => {
  try {
    const response = await api.post<APICommonResponse>(
      `/user/lock-transaction`,
      {
        id,
        isLocked: lock,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to lock transaction user')
  }
}

export const banUser = async ({
  id,
  ban,
}: {
  id: string
  ban: boolean
}): Promise<APICommonResponse> => {
  try {
    const response = await api.post<APICommonResponse>(`/user/ban`, {
      id,
      isBanned: ban,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to ban user')
  }
}

export const muteUser = async ({
  id,
  mute,
}: {
  id: string
  mute: boolean
}): Promise<APICommonResponse> => {
  try {
    const response = await api.post<APICommonResponse>(`/user/mute`, {
      id,
      isMuted: mute,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to mute user')
  }
}

export const updateUser = async ({
  id,
  data,
}: {
  id: string
  data: any
}): Promise<any> => {
  try {
    const response = await api.put<any>(`/user/${id}`, {
      data,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update user')
  }
}

export const updateUserAddress = async ({
  id,
  data,
  addressData,
}: {
  id: string
  data: any
  addressData: any
}): Promise<APICommonResponse> => {
  try {
    const response = await api.post<APICommonResponse>(`/user/update-details`, {
      id,
      data,
      addressData,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update user')
  }
}

export const adminReview = async ({
  id,
  status,
  comment,
}: {
  id: string
  status: string
  comment: string
}): Promise<APICommonResponse> => {
  try {
    const response = await api.post<APICommonResponse>(`/user/admin-review`, {
      id,
      status,
      comment,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to admin review user')
  }
}

export const updateUserBalance = async ({
  id,
  balance,
}: {
  id: string
  balance: number
}): Promise<APICommonResponse> => {
  try {
    const response = await api.post<APICommonResponse>(`/user/update-balance`, {
      id,
      balance,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update user balance')
  }
}

interface TransactionsParams extends PaginationParams {
  type: string
  userId: string
}

export interface TransactionsResponse {
  rows: GameTransaction[] | CryptoTransaction[] | ServiceTransaction[]
  pagination: Pagination
}
export const getTransactions = async ({
  page,
  limit,
  type,
  userId,
}: TransactionsParams): Promise<TransactionsResponse> => {
  const response = await api.get(`/user/transactions/${type}`, {
    params: { page, limit, userId },
  })

  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response.data
}
