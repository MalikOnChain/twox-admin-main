import { ITierData } from './tier'

export const WAGER_RACE_STATUS = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  SCHEDULED: 'Scheduled',
}

export const PARTICIPANT_TYPE = {
  ALL: 'All',
  RANK: 'Rank',
  INVITE: 'Invite',
}

export const PRIZE_TYPE = {
  PERCENTAGE: 'Percentage',
  FIXED: 'Fixed',
}

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Unpaid',
}

export const DELAY_TYPE = {
  HOUR: 'hours',
  DAY: 'days',
}

export const PAYOUT_TYPE = {
  AUTO: 'Auto',
  MANUAL: 'Manual',
}

export interface IParticipant {
  userId: string
  totalWagered: number
  username?: string
}

export interface IWagerRace {
  _id?: string
  title: string
  description?: string
  period: {
    start: string
    end: string
  }
  eligibleGames: string[]
  minWager: number
  prize: {
    type: string
    amounts: number[]
  }
  status: string
  participants: {
    type: string
    code?: string
    tiers?: string[]
    users?: IParticipant[]
  }
  paymentStatus: string
  payoutType: string
  delay: {
    type: string
    value: number
  }
  payout: {
    type: string
    value: number
  }
  winners: string[]
}

export interface IWagerRaceListResponse {
  success: boolean
  rows: IWagerRace[]
  options: {
    tiers: ITierData[]
  }
  pagination: {
    totalPages: number
    currentPage: number
  }
}

export interface IWagerRaceCreateResponse {
  success: boolean
  message: string
}

export interface IWagerRaceDetailResponse {
  success: boolean
  rows: IWagerRace
  options: {
    participants: IParticipant[]
  }
  pagination: {
    totalPages: number
    currentPage: number
  }
}
