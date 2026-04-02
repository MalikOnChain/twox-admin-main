import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { UTMLinkListResponse, UTMLinkSuccessResponse } from '@/types/utm-link'

export const createUtmLink = async (
  data: any
): Promise<UTMLinkSuccessResponse> => {
  try {
    const res = await api.post<UTMLinkSuccessResponse>('/utm-links', data)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create UTM link')
  }
}

export const getUtmLinks = async ({
  page,
  limit,
  filter,
  source,
}: {
  page: number
  limit: number
  filter: any
  source: string
}): Promise<UTMLinkListResponse> => {
  try {
    const res = await api.get<UTMLinkListResponse>('/utm-links', {
      params: {
        page,
        limit,
        filter,
        source,
      },
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get UTM links')
  }
}

export const deleteUtmLink = async (
  id: string
): Promise<UTMLinkSuccessResponse> => {
  try {
    const res = await api.delete<UTMLinkSuccessResponse>(`/utm-links/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete UTM link')
  }
}

export const uploadUtmImage = async (formData: FormData) => {
  try {
    const response = await api.post<{ url: string }>(
      `/utm-links/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload UTM image')
  }
}

export const updateUtmLink = async (
  id: string,
  data: any
): Promise<UTMLinkSuccessResponse> => {
  try {
    const res = await api.put<UTMLinkSuccessResponse>(`/utm-links/${id}`, data)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update UTM link')
  }
}
