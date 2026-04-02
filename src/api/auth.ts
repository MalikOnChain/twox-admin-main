import { ILoginUser } from '@/context/AuthContext'

import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import { IAuthResponse } from '@/types/auth'

export const signIn = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {
  try {
    const res = await api.post<IAuthResponse>('/auth/signin', {
      email,
      password,
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to sign in')
  }
}

type SignInWithGoogleResponse = {
  error?: string
  authUrl: string
}
export const signInWithGoogle = async (): Promise<SignInWithGoogleResponse> => {
  try {
    const res = await api.post<SignInWithGoogleResponse>('/auth/google/signin')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to sign in with google')
  }
}

export const signUp = async (
  fname: string,
  lname: string,
  email: string,
  password: string
) => {
  try {
    const res = await api.post<IAuthResponse>('/auth/signup', {
      fname,
      lname,
      email,
      password,
    })
    return res.data || []
  } catch (error) {
    handleApiError(error, 'Failed to sign up')
  }
}

interface GetCurrentUserResponse extends ILoginUser {
  error?: string
}

export const getCurrentUser = async () => {
  try {
    const res = await api.get<GetCurrentUserResponse>('/auth/me')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get current user')
  }
}

export const verify = async (email: string, otp?: string, token?: string) => {
  try {
    const res = await api.post<IAuthResponse>('/auth/verify', {
      email,
      otp,
      token,
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to verify')
  }
}

export const resendOTP = async (email: string) => {
  try {
    const res = await api.post('/auth/send-otp', { email })
    return res.data || []
  } catch (error) {
    handleApiError(error, 'Failed to resend OTP')
  }
}

export const exchangeToken = async (
  identifier: string
): Promise<{ token: string }> => {
  try {
    const response = await api.post<{ token: string }>('/auth/exchange-token', {
      identifier,
    })
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to exchange token')
  }
}
