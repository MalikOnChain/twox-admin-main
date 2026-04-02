import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IBlueOceanGame,
  IBlueOceanGamesListResponse,
} from '@/types/casino/blueocean'

export const getBlueOceanGamesList = async (params: {
  page: number
  limit: number
  type?: string
  filter: string
  code?: string
}): Promise<IBlueOceanGamesListResponse> => {
  try {
    const response = await api.get<IBlueOceanGamesListResponse>(
      '/casino/blueocean/list',
      {
        params,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get games list')
  }
}

export const updateBlueOceanGameDetail = async (
  game_code: string,
  params: { property: string; value: string | number | boolean }
): Promise<IBlueOceanGame> => {
  try {
    const response = await api.post<IBlueOceanGame>(
      `/casino/blueocean/update/${game_code}`,
      {
        params,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update game detail')
  }
}

export const getBlueOceanGameDetail = async (
  game_code: string
): Promise<IBlueOceanGame> => {
  try {
    const response = await api.get<IBlueOceanGame>(
      `/casino/blueocean/detail/${game_code}`
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get game detail')
  }
}

export const updateBlueOceanCasinoImage = async (
  game_code: string,
  image: string
): Promise<IBlueOceanGame> => {
  try {
    const response = await api.post<IBlueOceanGame>(
      `/casino/blueocean/update/image/${game_code}`,
      { image }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update casino image')
  }
}
