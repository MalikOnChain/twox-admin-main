import api from '@/lib/api'
import { handleApiError } from '@/lib/error'
import { OperatingProviderInvoiceFormValues } from '@/lib/operating-provider'

import { Pagination } from '@/types/common'
import { IOperatingProviderInvoice } from '@/types/operating-provider'

interface IProviderInvoiceListResponse {
  rows: IOperatingProviderInvoice[]
  pagination: Pagination
}

export const getProviderInvoices = async ({
  providerId,
  page,
  limit,
  filter,
}: {
  providerId: string
  page: number
  limit: number
  filter?: string
}): Promise<IProviderInvoiceListResponse> => {
  try {
    const response = await api.get<IProviderInvoiceListResponse>(
      '/operating-provider-invoice',
      {
        params: {
          providerId,
          page,
          limit,
          filter,
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get provider invoices')
  }
}

/**
 * Create a new provider
 * @param provider The provider data to create
 * @returns The created provider data
 */
export const createProviderInvoice = async (
  provider: OperatingProviderInvoiceFormValues
): Promise<any> => {
  try {
    const res = await api.post<any>('/operating-provider-invoice', provider)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create provider invoice')
  }
}

/**
 * Create a new provider
 * @param provider The provider data to create
 * @returns The created provider data
 */
export const updateProviderInvoice = async (
  id: string,
  provider: OperatingProviderInvoiceFormValues
): Promise<any> => {
  try {
    const res = await api.put<any>(
      `/operating-provider-invoice/${id}`,
      provider
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update provider invoice')
  }
}

export const deleteProviderInvoice = async (id: string): Promise<any> => {
  try {
    const res = await api.delete<any>(`/operating-provider-invoice/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete provider invoice')
  }
}
