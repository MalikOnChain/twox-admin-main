import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { IBotUsersListResponse } from '@/types/bot-users'

export const getBotUsers = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: string
}): Promise<IBotUsersListResponse> => {
  try {
    const response = await api.get<IBotUsersListResponse>('/bot-user/list', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get users')
  }
}

export const createBotUser = async ({ data }: { data: any }): Promise<any> => {
  try {
    const response = await api.post<any>('/bot-user/create', {
      data,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create bot user')
  }
}

export const updateBotUser = async ({
  id,
  data,
}: {
  id: string
  data: any
}): Promise<any> => {
  try {
    const response = await api.put<any>(`/bot-user/update/${id}`, {
      data,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update user')
  }
}

export const deleteBotUser = async ({ id }: { id: string }): Promise<any> => {
  try {
    const response = await api.delete<any>(`/bot-user/delete/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete user')
  }
}

export const uploadBotUserAvatar = async (formData: FormData) => {
  try {
    const response = await api.post<any>(`/bot-user/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload bot user avatar')
  }
}
