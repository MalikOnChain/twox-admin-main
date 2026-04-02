import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IBannerData,
  IBannerDetailResponse,
  IBannerImageResponse,
  IBannerListResponse,
  IBannerUpdateResponse,
} from '@/types/banner'

export const getBanners = async ({
  page,
  limit,
  filter,
  section,
}: {
  page: number
  limit: number
  filter?: string
  section?: string
}): Promise<IBannerListResponse> => {
  try {
    const response = await api.get<IBannerListResponse>('/banner/list', {
      params: {
        page,
        limit,
        filter,
        section,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get banners')
  }
}

export const createBanner = async ({
  title,
  image,
  position,
  language,
  device,
  section,
  bannerData,
}: IBannerData) => {
  try {
    const response = await api.post<IBannerUpdateResponse>('/banner/create', {
      title,
      image,
      position,
      language,
      device,
      section,
      bannerData,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create banner')
  }
}

export const updateBanner = async (
  id: string,
  { title, image, position, language, device, section, bannerData }: IBannerData
) => {
  try {
    const response = await api.post<IBannerUpdateResponse>(
      `/banner/update/${id}`,
      {
        title,
        image,
        position,
        language,
        device,
        section,
        bannerData,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update banner')
  }
}

export const getBannerDetail = async (id: string) => {
  try {
    const response = await api.get<IBannerDetailResponse>(`/banner/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update banner')
  }
}

export const deleteBanner = async (id: string, levelId?: string) => {
  try {
    const response = await api.delete<IBannerUpdateResponse>(
      `/banner/delete/${id}`,
      {
        params: {
          levelId,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete banner')
  }
}

export const uploadBannerImage = async (formData: FormData) => {
  try {
    // Don't set Content-Type header - axios will set it automatically with the boundary for FormData
    const response = await api.post<IBannerImageResponse>(
      `/banner/update-image`,
      formData
    )
    return response.data
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Banner image upload error:', error)
    console.error('Error response:', error?.response?.data)
    console.error('Error status:', error?.response?.status)
    
    // If there's a specific error message from the backend, use it
    const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to upload banner image'
    handleApiError(error, errorMessage)
  }
}
