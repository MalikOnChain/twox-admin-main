import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  GetTotalUTMTrackingResponse,
  GetUTMCampaignsResponse,
  GetUTMRegisteredUsersResponse,
  GetUTMTrackingPayload,
  GetUTMTrackingResponse,
} from '@/types/utm-track'

export const getUTMTracking = async (
  payload: GetUTMTrackingPayload
): Promise<GetUTMTrackingResponse> => {
  try {
    const res = await api.get<GetUTMTrackingResponse>('/utm-tracking', {
      params: payload,
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get utm tracking')
  }
}

export const getUTMRegisteredUsers = async (
  payload: GetUTMTrackingPayload
): Promise<GetUTMRegisteredUsersResponse> => {
  try {
    const res = await api.get<GetUTMRegisteredUsersResponse>(
      '/utm-tracking/users',
      {
        params: payload,
      }
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get utm registered users')
  }
}

export const getUTMCampaigns = async (
  payload: GetUTMTrackingPayload
): Promise<GetUTMCampaignsResponse> => {
  try {
    const res = await api.get<GetUTMCampaignsResponse>(
      '/utm-tracking/campaigns',
      {
        params: payload,
      }
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get utm campaigns')
  }
}

export const getTotalUTMTracking =
  async (): Promise<GetTotalUTMTrackingResponse> => {
    try {
      const res = await api.get<GetTotalUTMTrackingResponse>(
        '/utm-tracking/total'
      )
      return res.data
    } catch (error) {
      handleApiError(error, 'Failed to get total utm tracking')
    }
  }
