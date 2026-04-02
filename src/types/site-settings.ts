interface SiteSettings {
  depositMinAmount: number
  withdrawMinAmount: number
  withdrawMaxAmount: number
  withdrawWagerMultiplier: number
  allowedCountries: string[]
  xpSetting?: {
    status: string
    depositXpAmount: number
    wagerXpSetting: IwagerXpData[]
    // lossXpAmount: number
  }
  socialMediaSetting: {
    logo: string
    logoSymbol: string
    logoStyle: {
      height: number
      top: number
      left: number
    }
    logoSymbolStyle: {
      height: number
      top: number
      left: number
    }
    title: string
    slogan: string
    instagram: string
    facebook: string
    twitter: string
    whatsapp: string
    telegram: string
  }
  termsCondition: string
  privacyPolicy: string
  about: string
}
interface IwagerXpData {
  wagerXpAmount: number
  gameCategory: string
}

type CountryProps = {
  code: string
  name: string
}

type CheckResult = { ip: string; country: string | null; blocked: boolean }

interface IwagerXpData {
  wagerXpAmount: number
  gameCategory: string
}

interface ILogoResponse {
  success?: boolean
  message?: string
  url: string
}

export type {
  CheckResult,
  CountryProps,
  ILogoResponse,
  IwagerXpData,
  SiteSettings,
}
