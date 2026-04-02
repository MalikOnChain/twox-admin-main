import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IApikeyData,
  IApikeyListResponse,
  IApikeyUpdateResponse,
} from '@/types/apikey'

export const getApikeys = async ({
  page,
  limit,
  filter,
  scope,
}: {
  page: number
  limit: number
  filter?: string
  scope?: string
}): Promise<IApikeyListResponse> => {
  try {
    const response = await api.get<IApikeyListResponse>('/apikey/list', {
      params: {
        page,
        limit,
        filter,
        scope,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get apikeys')
  }
}

export const createApikey = async ({
  name,
  label,
  apiKey,
  expiryDate,
  createdBy,
  scope,
  status,
}: IApikeyData) => {
  try {
    const response = await api.post<IApikeyUpdateResponse>('/apikey/create', {
      name,
      label,
      scope,
      apiKey,
      expiryDate,
      status,
      createdBy,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create apikey')
  }
}

export const updateApikey = async (
  id: string,
  { name, label, apiKey, expiryDate, status, scope, createdBy }: IApikeyData
) => {
  try {
    const response = await api.post<IApikeyUpdateResponse>(
      `/apikey/update/${id}`,
      {
        name,
        label,
        apiKey,
        expiryDate,
        scope,
        status,
        createdBy,
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update apikey')
  }
}

export const deleteApikey = async (id: string, apiKey?: string) => {
  try {
    const response = await api.delete<IApikeyUpdateResponse>(
      `/apikey/delete/${id}`,
      {
        params: {
          apiKey,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete apikey')
  }
}
