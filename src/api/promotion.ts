import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IPromotionData,
  IPromotionDetailResponse,
  IPromotionImageResponse,
  IPromotionListResponse,
  IPromotionUpdateResponse,
} from '@/types/promotion'

export const getPromotions = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter?: string
}): Promise<IPromotionListResponse> => {
  try {
    const response = await api.get<IPromotionListResponse>('/promotion/list', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get promotions')
  }
}

export const createPromotion = async ({
  name,
  image,
  summary,
  description,
  bonusId,
  isPublic,
  badge,
  colorTheme,
  highlightText,
  buttons,
}: IPromotionData) => {
  try {
    const response = await api.post<IPromotionUpdateResponse>(
      '/promotion/create',
      {
        name,
        image,
        description,
        bonusId,
        isPublic,
        badge,
        colorTheme,
        highlightText,
        buttons,
        summary,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create promotion')
  }
}

export const updatePromotion = async (
  id: string,
  {
    name,
    image,
    summary,
    description,
    bonusId,
    isPublic,
    badge,
    colorTheme,
    highlightText,
    buttons,
  }: IPromotionData
) => {
  try {
    const response = await api.post<IPromotionUpdateResponse>(
      `/promotion/update/${id}`,
      {
        name,
        image,
        description,
        bonusId,
        isPublic,
        badge,
        colorTheme,
        highlightText,
        buttons,
        summary,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update promotion')
  }
}

export const getPromotionDetail = async (id: string) => {
  try {
    const response = await api.get<IPromotionDetailResponse>(`/promotion/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update promotion')
  }
}

export const deletePromotion = async (id: string, levelId?: string) => {
  try {
    const response = await api.delete<IPromotionUpdateResponse>(
      `/promotion/delete/${id}`,
      {
        params: {
          levelId,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete promotion')
  }
}

export const uploadPromotionImage = async (formData: FormData) => {
  try {
    const response = await api.post<IPromotionImageResponse>(
      `/promotion/update-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload promotion image')
  }
}
