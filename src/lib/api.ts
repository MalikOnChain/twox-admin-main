// lib/api.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

import storageHandler from './storage-utils'

// Token management with type safety
const tokenStorage = storageHandler({ key: 'token' })

// Environment variables
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_API
if (!API_URL) {
  console.warn('Backend API URL is not defined in environment variables')
}

// Create and configure axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // Add a reasonable timeout
})

// Constants
const AUTH_TOKEN_HEADER = 'x-auth-token'

/**
 * Add request interceptor to handle authentication and timezone
 */
api.interceptors.request.use(
  (request) => {
    const token = tokenStorage.getValue()
    if (token) {
      request.headers['x-auth-token'] = `${token}`
    }
    // Always send timezone header (required by backend for date-based queries)
    request.headers['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // If the request data is FormData, remove Content-Type header to let axios set it with boundary
    if (request.data instanceof FormData) {
      delete request.headers['Content-Type']
    }
    
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Add response interceptor to handle token refresh and errors
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Check if new auth token exists in response headers
    const newAccessToken = response.headers[AUTH_TOKEN_HEADER]

    if (newAccessToken) {
      tokenStorage.setValue(newAccessToken)
    }

    return response
  },
  async (error: AxiosError): Promise<never> => {
    // Handle network errors (no response received)
    if (!error.response) {
      return Promise.reject(
        new Error('Network error: Please check your internet connection')
      )
    }

    // Handle authentication errors
    if ([401, 403].includes(error.response.status)) {
      tokenStorage.removeValue()
      window.location.href = '/'
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api
