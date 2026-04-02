export type IMetrics = {
  key: string
  value: number
  upgradingPercentage: number
}[]

export interface IMainGGRStats {
  grossGGR: number
  bonusCost: number
  refundAndChargeBack: number
  providerFee: number
  operationCost: number
  affiliateCommissions: number
  withdrawCost: number
  netGGR: number
}

export interface IAnalytics {
  dimensionValues: { value: string }[]
  metricValues: { value: string }[]
}

export interface IConversionRates {
  dimensionValues: { value: string }[]
  metricValues: { value: string }[]
}

export interface IConversionRates {
  registrationConversionRate: number
  error?: string
}

export enum MetricsFilterOptions {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}
