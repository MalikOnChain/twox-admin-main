import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  GameProvider,
  GameProviderListResponse,
  GameProviderType,
  IGameProviderImageResponse,
} from '@/types/game-provider'

export const getGameProviders = async (): Promise<GameProviderListResponse> => {
  try {
    const response = await api.get<{ success: boolean; data: any[] }>(
      `/casino/blueocean/providers`
    )
    
    // Transform response to match expected GameProvider format
    const providers: GameProvider[] = (response.data.data || []).map((provider: any) => ({
      _id: provider._id,
      code: provider.code,
      name: provider.name,
      banner: provider.image,
      type: provider.type as GameProviderType,
      countGames: provider.gamesCount || 0,
      status: (provider.status !== undefined ? provider.status : 1) as 0 | 1, // Use status from backend, default to 1
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    }))
    
    return {
      rows: providers,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        total: providers.length,
      },
    }
  } catch (error) {
    handleApiError(error, 'Failed to get providers')
  }
}

export const getGameProviderByCode = async (
  type: string,
  code: string
): Promise<GameProvider> => {
  try {
    const response = await api.get<{ success: boolean; provider: any }>(
      `/casino/blueocean/provider/${code}`
    )
    
    // Transform response to match expected format
    if (response.data.success && response.data.provider) {
      const prov = response.data.provider
      return {
        code: prov.code,
        name: prov.name,
        banner: prov.image,
        type: prov.type as GameProviderType,
        status: (prov.status !== undefined ? prov.status : 1) as 0 | 1, // Use status from backend, default to 1
        countGames: prov.gamesCount || 0,
      }
    }
    
    throw new Error('Provider not found')
  } catch (error) {
    handleApiError(error, 'Failed to get provider')
  }
}

/**
 * Toggle status of a game provider
 * @returns The created game provider data
 */
export const toggleGameProvider = async (
  type: string,
  id: string
): Promise<any> => {
  try {
    const res = await api.post<any>(`/game-provider/toggle/${type}/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update game provider')
  }
}

export const getBalanceOfAgent = async (type: string) => {
  try {
    const response = await api.get<{ balance: number }>(
      `/game-provider/${type}/balance`
    )
    return response.data.balance
  } catch (error) {
    handleApiError(error, 'Failed to get providers')
  }
}

export const updateGameProvider = async (
  id: string,
  { banner }: GameProvider
) => {
  try {
    const response = await api.post<IGameProviderImageResponse>(
      `/game-provider/update/${id}`,
      {
        banner,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update Game Provider')
  }
}

export const uploadProviderImage = async (formData: FormData) => {
  try {
    const response = await api.post<IGameProviderImageResponse>(
      `/game-provider/update-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload Game Provider image')
  }
}
