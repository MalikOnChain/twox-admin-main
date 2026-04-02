import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  ICashbackData,
  ICashbackListResponse,
  ICashbackLogsResponse,
  ICashbackUpdateResponse,
} from '@/types/cashback'

export const getCashbacks = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: string
}): Promise<ICashbackListResponse> => {
  try {
    const response = await api.get<ICashbackListResponse>('/cashback/list', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get cashbacks')
  }
}

export const createCashback = async ({
  name,
  type,
  tiers,
  claimFrequency,
  default: defaultConfig,
  timeBoost,
  gameSpecific,
  status,
  wagerMultiplier,
}: ICashbackData) => {
  try {
    const response = await api.post<ICashbackUpdateResponse>(
      '/cashback/create',
      {
        name,
        type,
        tiers,
        claimFrequency,
        default: defaultConfig,
        timeBoost,
        gameSpecific,
        status,
        wagerMultiplier,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create cashback')
  }
}

export const updateCashback = async (
  id: string,
  {
    name,
    type,
    tiers,
    claimFrequency,
    default: defaultConfig,
    timeBoost,
    gameSpecific,
    status,
    wagerMultiplier,
  }: ICashbackData
) => {
  try {
    const response = await api.post<ICashbackUpdateResponse>(
      `/cashback/update/${id}`,
      {
        name,
        type,
        tiers,
        claimFrequency,
        default: defaultConfig,
        timeBoost,
        gameSpecific,
        status,
        wagerMultiplier,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update cashback')
  }
}

export const deleteCashback = async (id: string) => {
  try {
    const response = await api.delete<ICashbackUpdateResponse>(
      `/cashback/delete/${id}`
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete cashback')
  }
}

export const getCashbackLogs = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: string
}) => {
  try {
    const response = await api.get<ICashbackLogsResponse>('/cashback/logs', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get cashback logs')
  }
}
