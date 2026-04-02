import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { IPermission, IRole, IRolesListResponse } from '@/types/role'

export const getRoles = async ({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<IRolesListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    const response = await api.get<IRolesListResponse>('/roles', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get roles')
  }
}

export const getRoleById = async (id: string): Promise<IRole> => {
  try {
    const response = await api.get<IRole>(`/roles/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get role by id')
  }
}

export const createRole = async (roleData: IRole): Promise<IRole> => {
  try {
    const response = await api.post<IRole>('/roles', roleData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create role')
  }
}

export const updateRole = async (
  id: string,
  roleData: Partial<IRole>
): Promise<IRole> => {
  try {
    const response = await api.put<IRole>(`/roles/${id}`, roleData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update role')
  }
}

export const deleteRole = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/roles/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete role')
  }
}

export const getPermissions = async (): Promise<IPermission[]> => {
  try {
    const response = await api.get<IPermission[]>('/roles/permissions')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get permissions')
  }
}

export const getAllRoles = async (): Promise<IRole[]> => {
  try {
    const response = await api.get<IRole[]>('/roles/all')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get all roles')
  }
}
