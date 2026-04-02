import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IRaffle {
  _id: string
  name: string
  description?: string
  type: 'paid' | 'free' | 'hybrid'
  ticketPrice?: number
  maxTickets?: number
  maxTicketsPerUser?: number
  startDate: string
  endDate: string
  drawDate: string
  prizes: Array<{
    position: number
    type: 'cash' | 'bonus' | 'free_spins'
    amount: number
    description?: string
  }>
  eligibility?: {
    minDeposit?: number
    minWager?: number
    vipTiers?: string[]
    countries?: string[]
  }
  status: 'draft' | 'active' | 'ended' | 'drawn' | 'cancelled'
  winners?: Array<{
    userId: string
    ticketNumber: string
    position: number
    prize: {
      type: string
      amount: number
    }
    drawnAt?: string
  }>
  brandCaps?: {
    maxTotalPrizes?: number
    maxDailyPrizes?: number
    maxWeeklyPrizes?: number
  }
  totalTicketsSold: number
  totalRevenue: number
  totalParticipants: number
  createdAt?: string
  updatedAt?: string
}

export interface IRaffleTicket {
  _id: string
  raffleId: string | { _id: string; name: string; type: string }
  userId: string | { _id: string; username: string; email?: string }
  ticketNumber: string
  purchasePrice?: number
  purchaseDate: string
  isWinner: boolean
  prizePosition?: number
  createdAt?: string
}

export interface IRaffleAnalytics {
  dailySales: Array<{
    date: string
    tickets: number
    revenue: number
  }>
  salesByType: Array<{
    type: string
    tickets: number
    revenue: number
  }>
  winnerStats: Array<{
    raffleId: string
    winners: number
    totalPrizeValue: number
  }>
}

export const getRaffles = async (params?: {
  page?: number
  limit?: number
  status?: string
  type?: string
}): Promise<{
  success: boolean
  data: IRaffle[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/raffles', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch raffles')
    throw error
  }
}

export const getRaffleDetails = async (
  id: string
): Promise<{
  success: boolean
  data: IRaffle & { ticketStats: any }
}> => {
  try {
    const response = await api.get(`/raffles/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch raffle details')
    throw error
  }
}

export const getTicketSales = async (params?: {
  raffleId?: string
  page?: number
  limit?: number
}): Promise<{
  success: boolean
  data: IRaffleTicket[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}> => {
  try {
    const response = await api.get('/raffles/tickets/sales', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch ticket sales')
    throw error
  }
}

export const getRaffleAnalytics = async (params?: {
  raffleId?: string
  days?: number
}): Promise<{ success: boolean; data: IRaffleAnalytics }> => {
  try {
    const response = await api.get('/raffles/analytics', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch raffle analytics')
    throw error
  }
}

export const getWinners = async (params?: {
  raffleId?: string
}): Promise<{ success: boolean; data: IRaffleTicket[] }> => {
  try {
    const response = await api.get('/raffles/winners', { params })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch winners')
    throw error
  }
}

export const createRaffle = async (
  data: Partial<IRaffle>
): Promise<{ success: boolean; data: IRaffle }> => {
  try {
    const response = await api.post('/raffles', data)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to create raffle')
    throw error
  }
}

export const updateRaffle = async (
  id: string,
  data: Partial<IRaffle>
): Promise<{ success: boolean; data: IRaffle }> => {
  try {
    const response = await api.put(`/raffles/${id}`, data)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to update raffle')
    throw error
  }
}

export const drawWinners = async (
  id: string
): Promise<{ success: boolean; data: IRaffle; message: string }> => {
  try {
    const response = await api.post(`/raffles/${id}/draw`)
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to draw winners')
    throw error
  }
}

