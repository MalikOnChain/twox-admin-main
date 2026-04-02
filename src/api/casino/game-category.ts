// api/casino/game-category.ts
import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  GameCategoryDeleteResponse,
  GameCategoryDetailResponse,
  GameCategoryFormData,
  GameCategoryFormResponse,
  GameCategoryListRequest,
  GameCategoryListResponse,
  IconUploadResponse,
} from '@/types/game-category'

export const getGameCategories = async (
  params?: GameCategoryListRequest
): Promise<GameCategoryListResponse> => {
  try {
    const response = await api.get('/game-categories', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get game categories')
    throw error
  }
}

export const getGameCategory = async (
  id: string
): Promise<GameCategoryDetailResponse> => {
  try {
    const response = await api.get(`/game-categories/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get game category')
    throw error
  }
}

export const createGameCategory = async (
  payload: GameCategoryFormData
): Promise<GameCategoryFormResponse> => {
  try {
    const response = await api.post('/game-categories', payload)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create game category')
    throw error
  }
}

export const updateGameCategory = async (
  id: string,
  payload: Partial<GameCategoryFormData>
): Promise<GameCategoryFormResponse> => {
  try {
    const response = await api.put(`/game-categories/${id}`, payload)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update game category')
    throw error
  }
}

export const deleteGameCategory = async (
  id: string
): Promise<GameCategoryDeleteResponse> => {
  try {
    const response = await api.delete(`/game-categories/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete game category')
    throw error
  }
}

export const uploadIcon = async (
  formData: FormData
): Promise<IconUploadResponse> => {
  try {
    const response = await api.post('/game-categories/upload-icon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload game category icon')
    throw error
  }
}
