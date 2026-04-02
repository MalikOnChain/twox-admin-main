import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  ITierData,
  ITierIconResponse,
  ITierListResponse,
  ITierUpdateResponse,
} from '@/types/tier'

export const getTiers = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter?: string
}): Promise<ITierListResponse> => {
  try {
    const response = await api.get<ITierListResponse>('/tier/list', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get tiers')
  }
}

export const createTier = async ({
  name,
  levels,
  downgradePeriod,
  icon,
}: ITierData) => {
  try {
    const response = await api.post<ITierUpdateResponse>('/tier/create', {
      name,
      levels,
      downgradePeriod,
      icon,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create tier')
  }
}

export const updateTier = async (
  id: string,
  { name, levels, downgradePeriod, icon }: ITierData
) => {
  try {
    const response = await api.post<ITierUpdateResponse>(`/tier/update/${id}`, {
      icon,
      name,
      levels,
      downgradePeriod,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update tier')
  }
}

export const deleteTier = async (id: string, levelId?: string) => {
  try {
    const response = await api.delete<ITierUpdateResponse>(
      `/tier/delete/${id}`,
      {
        params: {
          levelId,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete tier')
  }
}

export const uploadTierIcon = async (formData: FormData) => {
  try {
    const response = await api.post<ITierIconResponse>(
      `/tier/update-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload tier icon')
  }
}
