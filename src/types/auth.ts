export interface IAuthData {
  email: string
  password: string
}

export interface IAuthResponse {
  identifier?: string
  OTPRequired?: boolean
  twoFARequired?: boolean
  isAuthenticated?: boolean
  error?: any
}

export interface IVerifyInput {
  otp: string
  token: string
  email: string
}

export interface ISignInInput {
  email: string
  password: string
}

export type MessageType = {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export type AuthVerification = {
  OTPRequired: boolean
  twoFARequired: boolean
  email: string
}
