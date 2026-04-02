import api from '@/lib/api'
import { handleApiError } from '@/lib/error'
import { OperatingProviderFormValues } from '@/lib/operating-provider'

import { Pagination } from '@/types/common'
import { IOperatingProvider } from '@/types/operating-provider'

interface IProviderListResponse {
  rows: IOperatingProvider[]
  pagination: Pagination
}

export const getProviders = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter?: string
}): Promise<IProviderListResponse> => {
  try {
    const response = await api.get<IProviderListResponse>(
      '/operating-provider',
      {
        params: {
          page,
          limit,
          filter,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get providers')
  }
}

/**
 * Create a new provider
 * @param provider The provider data to create
 * @returns The created provider data
 */
export const createProvider = async (
  provider: OperatingProviderFormValues
): Promise<any> => {
  try {
    const res = await api.post<any>('/operating-provider', provider)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create provider')
  }
}

/**
 * Create a new provider
 * @param provider The provider data to create
 * @returns The created provider data
 */
export const updateProvider = async (
  id: string,
  provider: OperatingProviderFormValues
): Promise<any> => {
  try {
    const res = await api.put<any>(`/operating-provider/${id}`, provider)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update provider')
  }
}

export const deleteProvider = async (id: string): Promise<any> => {
  try {
    const res = await api.delete<any>(`/operating-provider/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete provider')
  }
}
