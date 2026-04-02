import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

export interface IMethodLimit {
  method?: string
  currency?: string
  depositMin?: number
  depositMax?: number
  withdrawMin?: number
  withdrawMax?: number
}

export interface IDailyCaps {
  depositCap?: number
  withdrawCap?: number
}

export interface IMethodFee {
  method?: string
  currency?: string
  feePercent?: number
  fixedFee?: number
}

export interface IFees {
  depositFeePercent?: number
  withdrawFeePercent?: number
  methodFees?: IMethodFee[]
}

export interface IProcessingTier {
  tier?: string
  minAmount?: number
  maxAmount?: number
  processingTime?: number
  description?: string
}

export interface IRegionAvailability {
  region?: string
  methods?: string[]
  enabled?: boolean
}

export interface IVipOverride {
  tierId?: string
  tierName?: string
  methodLimits?: IMethodLimit[]
  fees?: {
    depositFeePercent?: number
    withdrawFeePercent?: number
  }
  dailyCaps?: {
    depositCap?: number
    withdrawCap?: number
  }
}

export interface IPaymentSettings {
  methodLimits?: IMethodLimit[]
  dailyCaps?: IDailyCaps
  fees?: IFees
  processingTiers?: IProcessingTier[]
  regionAvailability?: IRegionAvailability[]
  vipOverrides?: IVipOverride[]
}

export interface IPaymentSettingsResponse {
  success: boolean
  data: {
    depositMinAmount: number
    withdrawMinAmount: number
    withdrawMaxAmount: number
    paymentSettings: IPaymentSettings
    availableMethods: string[]
    availableCurrencies: string[]
    availableRegions: string[]
    vipTiers: Array<{
      _id: string
      name: string
    }>
  }
}

export const getPaymentSettings = async (): Promise<IPaymentSettingsResponse['data']> => {
  try {
    const response = await api.get<IPaymentSettingsResponse>('/payment-settings')
    return response.data.data
  } catch (error) {
    handleApiError(error, 'Failed to fetch payment settings')
    throw error
  }
}

export const updatePaymentSettings = async (
  paymentSettings: IPaymentSettings
): Promise<IPaymentSettings> => {
  try {
    const response = await api.put<{ success: boolean; data: IPaymentSettings }>(
      '/payment-settings',
      { paymentSettings }
    )
    return response.data.data
  } catch (error) {
    handleApiError(error, 'Failed to update payment settings')
    throw error
  }
}

