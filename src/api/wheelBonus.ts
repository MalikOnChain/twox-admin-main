import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface WheelBonus {
  _id?: string
  name: string
  status: 'active' | 'inactive'
  wheelBonusAmounts: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
  wheelBonusWeights: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
  validFrom: string
  validTo: string
  createdAt?: string
  updatedAt?: string
}

export interface WheelBonusResponse {
  success: boolean
  data?: WheelBonus | WheelBonus[]
  message?: string
  error?: string
}

/**
 * Get all wheel bonuses
 * @returns List of wheel bonuses
 */
export const getAllWheelBonuses = async (): Promise<WheelBonusResponse> => {
  try {
    const res = await api.get<WheelBonusResponse>('/bonus/wheel-bonus')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get wheel bonuses')
  }
}

/**
 * Get a single wheel bonus by ID
 * @param id The ID of the wheel bonus to retrieve
 * @returns The wheel bonus data
 */
export const getWheelBonusById = async (
  id: string
): Promise<WheelBonusResponse> => {
  try {
    const res = await api.get<WheelBonusResponse>(`/bonus/wheel-bonus/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get wheel bonus')
  }
}

/**
 * Create a new wheel bonus
 * @param wheelBonusData The wheel bonus data to create
 * @returns The created wheel bonus data
 */
export const createWheelBonus = async (
  wheelBonusData: Omit<WheelBonus, '_id'>
): Promise<WheelBonusResponse> => {
  try {
    const res = await api.post<WheelBonusResponse>(
      '/bonus/wheel-bonus',
      wheelBonusData
    )

    if (res.data.error) {
      throw new Error(res.data.error)
    }

    if (res.status !== 201) {
      throw new Error(res.statusText)
    }
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create wheel bonus')
  }
}

/**
 * Update a wheel bonus
 * @param id The ID of the wheel bonus to update
 * @param wheelBonusData The updated wheel bonus data
 * @returns The updated wheel bonus data
 */
export const updateWheelBonus = async (
  id: string,
  wheelBonusData: Partial<WheelBonus>
): Promise<WheelBonusResponse> => {
  try {
    const res = await api.put<WheelBonusResponse>(
      `/bonus/wheel-bonus/${id}`,
      wheelBonusData
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update wheel bonus')
  }
}

/**
 * Delete a wheel bonus
 * @param id The ID of the wheel bonus to delete
 * @returns The deletion response
 */
export const deleteWheelBonus = async (
  id: string
): Promise<WheelBonusResponse> => {
  try {
    const res = await api.delete<WheelBonusResponse>(`/bonus/wheel-bonus/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete wheel bonus')
  }
}
