import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IBonusSchedule {
  _id: string
  name: string
  description?: string
  bonusId: string | { _id: string; name: string; type: string }
  scheduleType: 'one-time' | 'recurring' | 'rule-based'
  scheduledDate?: string
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    daysOfWeek?: number[]
    dayOfMonth?: number
    time?: string
    timezone?: string
    endDate?: string
    occurrences?: number
  }
  ruleConditions?: Array<{
    type: 'vip_tier' | 'deposit' | 'wager' | 'date' | 'custom'
    operator: 'equals' | 'greater_than' | 'greater_equal' | 'less_than' | 'less_equal' | 'in' | 'not_in'
    value: any
    field?: string
  }>
  ruleActions?: Array<{
    type: 'grant_bonus' | 'send_notification' | 'update_tier'
    bonusId?: string
    bonusType?: string
    amount?: number
    message?: string
  }>
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  isActive: boolean
  lastExecuted?: string
  nextExecution?: string
  executionCount: number
  maxExecutions?: number
}

export interface ICalendarEvent {
  id: string
  title: string
  start: string | Date
  end?: string | Date
  extendedProps: {
    scheduleId: string
    bonusId?: string
    scheduleType: string
    status: string
  }
}

export interface IVipTier {
  _id: string
  name: string
  level?: string
}

export const getSchedules = async (params?: {
  page?: number
  limit?: number
  status?: string
  scheduleType?: string
}): Promise<{ success: boolean; data: IBonusSchedule[]; pagination: any }> => {
  try {
    const response = await api.get('/bonus-scheduling/schedules', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch schedules')
    throw error
  }
}

export const getCalendarEvents = async (params?: {
  start?: string
  end?: string
}): Promise<{ success: boolean; data: ICalendarEvent[] }> => {
  try {
    const response = await api.get('/bonus-scheduling/calendar/events', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch calendar events')
    throw error
  }
}

export const getRecurringTemplates = async (): Promise<{
  success: boolean
  data: IBonusSchedule[]
}> => {
  try {
    const response = await api.get('/bonus-scheduling/templates/recurring')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch recurring templates')
    throw error
  }
}

export const getRules = async (): Promise<{
  success: boolean
  data: IBonusSchedule[]
  vipTiers: IVipTier[]
}> => {
  try {
    const response = await api.get('/bonus-scheduling/rules')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch rules')
    throw error
  }
}

export const createSchedule = async (
  scheduleData: Partial<IBonusSchedule>
): Promise<{ success: boolean; data: IBonusSchedule }> => {
  try {
    const response = await api.post('/bonus-scheduling/schedules', scheduleData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create schedule')
    throw error
  }
}

export const updateSchedule = async (
  id: string,
  scheduleData: Partial<IBonusSchedule>
): Promise<{ success: boolean; data: IBonusSchedule }> => {
  try {
    const response = await api.put(`/bonus-scheduling/schedules/${id}`, scheduleData)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update schedule')
    throw error
  }
}

export const deleteSchedule = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/bonus-scheduling/schedules/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to delete schedule')
    throw error
  }
}

