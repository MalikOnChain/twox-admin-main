import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IWagerRace,
  IWagerRaceDetailResponse,
  IWagerRaceListResponse,
} from '@/types/wagerRace'

export const getWagerRaces = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter?: string
}): Promise<IWagerRaceListResponse> => {
  try {
    const response = await api.get<IWagerRaceListResponse>('/wager-race/list', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get wager races')
  }
}

export const createWagerRace = async (wagerRace: IWagerRace) => {
  try {
    const response = await api.post('/wager-race/create', wagerRace)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create wager race')
  }
}

export const updateWagerRace = async ({
  id,
  wagerRace,
}: {
  id: string
  wagerRace: IWagerRace
}) => {
  try {
    const response = await api.post(`/wager-race/update/${id}`, wagerRace)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update wager race')
  }
}

export const deleteWagerRace = async (id: string) => {
  try {
    const response = await api.delete(`/wager-race/delete/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete wager race')
  }
}

export const getWagerRaceById = async ({
  id,
  page,
  limit,
}: {
  id: string
  page: number
  limit: number
}) => {
  try {
    const response = await api.get<IWagerRaceDetailResponse>(
      `/wager-race/get/${id}`,
      {
        params: {
          page,
          limit,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get wager race by id')
  }
}
