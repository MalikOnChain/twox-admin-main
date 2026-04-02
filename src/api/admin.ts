import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  IAdmin,
  IAdminDataCollection,
  IAdminsListResponse,
} from '@/types/admin'

export const getAdmins = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<IAdminsListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<IAdminsListResponse>('/admins', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get admins')
  }
}

export const getAdminById = async (
  id: string
): Promise<IAdminDataCollection> => {
  try {
    const response = await api.get<IAdminDataCollection>(`/admins/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get admin')
  }
}

export const createAdmin = async (adminData: IAdmin): Promise<IAdmin> => {
  try {
    const response = await api.post<IAdmin>('/admins', adminData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create admin')
  }
}

export const updateAdmin = async (
  id: string,
  adminData: Partial<IAdmin>
): Promise<IAdmin> => {
  try {
    const response = await api.put<IAdmin>(`/admins/${id}`, adminData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create admin')
  }
}

export const deleteAdmin = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/admins/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete admin')
  }
}

export const uploadAvatar = async (formData: FormData) => {
  try {
    const response = await api.post('/admins/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload admin avatar')
  }
}

// Session management
export const getAdminSessions = async (id: string): Promise<{ sessions: any[] }> => {
  try {
    const response = await api.get<{ sessions: any[] }>(`/admins/${id}/sessions`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get admin sessions')
    throw error
  }
}

export const terminateSession = async (id: string, sessionId: string): Promise<void> => {
  try {
    await api.delete(`/admins/${id}/sessions/${sessionId}`)
  } catch (error) {
    handleApiError(error, 'Failed to terminate session')
    throw error
  }
}

export const terminateAllSessions = async (id: string, currentSessionId?: string): Promise<void> => {
  try {
    await api.post(`/admins/${id}/sessions/terminate-all`, { currentSessionId })
  } catch (error) {
    handleApiError(error, 'Failed to terminate all sessions')
    throw error
  }
}

// 2FA management
export const toggle2FA = async (id: string, enabled: boolean): Promise<{ twoFASecret?: string }> => {
  try {
    const response = await api.post<{ twoFASecret?: string }>(`/admins/${id}/toggle-2fa`, { enabled })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to toggle 2FA')
    throw error
  }
}

// Dashboard layout
export const getDashboardLayout = async (id: string): Promise<{ dashboardLayout: any[] }> => {
  try {
    const response = await api.get<{ dashboardLayout: any[] }>(`/admins/${id}/dashboard-layout`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get dashboard layout')
    throw error
  }
}

export const updateDashboardLayout = async (id: string, dashboardLayout: any[]): Promise<void> => {
  try {
    await api.put(`/admins/${id}/dashboard-layout`, { dashboardLayout })
  } catch (error) {
    handleApiError(error, 'Failed to update dashboard layout')
    throw error
  }
}
