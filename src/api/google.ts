import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

type GoogleConnectResponse = {
  authUrl: string
}
export const connectGoogle = async (): Promise<GoogleConnectResponse> => {
  try {
    const res = await api.post<GoogleConnectResponse>('/auth/google/connect')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to connect google')
  }
}

type GoogleDisconnectResponse = {
  error?: string
  success: boolean
  message: string
}

export const disconnectGoogle = async (): Promise<GoogleDisconnectResponse> => {
  try {
    const res = await api.post<GoogleDisconnectResponse>('/auth/google/connect')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to disconnect google')
  }
}
