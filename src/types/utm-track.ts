import { Pagination } from '@/types/common'

export interface UTMUser {
  _id: string
  username: string
  email: string
  created_at: string
  utm_source: string
  utm_campaign: string
  firstDepositAmount: number
  secondDepositAmount: number
  createdAt: string
}

export interface UTMTrackingTotalRow {
  source: string
  visitors: number
  registeredUsers: number
  firstDeposits: number
  secondDeposits: number
  totalFirstDeposits: number
  totalSecondDeposits: number
}

export interface GetTotalUTMTrackingResponse {
  rows: UTMTrackingTotalRow[]
}

export interface GetUTMTrackingResponse {
  utmVisitors: number
  registeredUsers: number
  firstDeposits: {
    count: number
    amount: number
  }
  secondDeposits: {
    count: number
    amount: number
  }
  sourceDistribution: {
    source: string
    count: number
  }[]
  timeSeriesData: {
    date: string
    visitors: number
  }[]
}

export interface GetUTMTrackingFilter {
  date_from: string
  date_to: string
  utm_source: string
  utm_campaign?: string
}

export interface GetUTMTrackingPayload {
  filter?: GetUTMTrackingFilter
  page?: number
  limit?: number
}

export interface GetUTMRegisteredUsersResponse {
  rows: UTMUser[]
  pagination: Pagination
}

export interface UTMCampaign {
  _id: string
  name: string
  visitors: number
  registrations: number
  firstDeposits: number
  conversionRate: number
}

export type GetUTMCampaignsResponse = UTMCampaign[]
