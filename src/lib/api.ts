// lib/api.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

import storageHandler from './storage-utils'

const tokenStorage = storageHandler({ key: 'token' })

/**
 * Browser: same-origin `/api/admin-bff/*` → App Router proxy (`app/api/admin-bff/[...path]/route.ts`).
 * Avoids CORS / mixed-content. Proxy reads ADMIN_BACKEND_INTERNAL_URL at request time (local + Vercel).
 *
 * Direct cross-origin API (legacy): NEXT_PUBLIC_USE_DIRECT_API=true and NEXT_PUBLIC_BACKEND_API=https://…/api
 */
const DIRECT_API = process.env.NEXT_PUBLIC_BACKEND_API?.trim() || ''
const USE_DIRECT_API =
  typeof process.env.NEXT_PUBLIC_USE_DIRECT_API === 'string' &&
  process.env.NEXT_PUBLIC_USE_DIRECT_API.toLowerCase() === 'true'

function serverSideApiBase(): string {
  const internal = process.env.ADMIN_BACKEND_INTERNAL_URL?.trim().replace(/\/$/, '')
  if (internal) return internal
  if (DIRECT_API) return DIRECT_API
  return 'http://127.0.0.1:5000/api'
}

function resolveBaseURL(): string {
  if (typeof window === 'undefined') {
    return serverSideApiBase()
  }
  if (USE_DIRECT_API && DIRECT_API) {
    return DIRECT_API
  }
  return '/api/admin-bff'
}

/** Effective axios baseURL for this runtime (browser proxy path or absolute server URL). */
export const API_URL = resolveBaseURL()

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
})

const AUTH_TOKEN_HEADER = 'x-auth-token'

function requestPathFromConfig(config: {
  url?: string
  baseURL?: string
}): string {
  const raw = (config.url || '').split('?')[0]
  if (raw.startsWith('http')) {
    try {
      return new URL(raw).pathname
    } catch {
      return raw
    }
  }
  const base = (config.baseURL || '').replace(/\/$/, '')
  if (base && raw.startsWith('/')) {
    return `${base}${raw}`.replace(/([^:]\/)\/+/g, '$1')
  }
  return raw
}

const AUTH_PUBLIC_POST_PATHS = [
  '/auth/signin',
  '/auth/google/signin',
  '/auth/exchange-token',
  '/auth/signup',
  '/auth/verify',
  '/auth/send-otp',
]

function skipGlobalAuthRedirectOnError(config: {
  method?: string
  url?: string
  baseURL?: string
}): boolean {
  const method = (config.method || 'get').toLowerCase()
  if (method !== 'post') return false
  const path = requestPathFromConfig(config)
  return AUTH_PUBLIC_POST_PATHS.some((p) => path.endsWith(p))
}

function readAuthTokenHeader(headers: AxiosResponse['headers']): string | undefined {
  const want = AUTH_TOKEN_HEADER.toLowerCase()
  const key = Object.keys(headers).find((k) => k.toLowerCase() === want)
  if (!key) return undefined
  const v = headers[key]
  if (typeof v === 'string') return v
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0]
  return undefined
}

function describeNetworkFailure(error: AxiosError): string {
  const code = error.code
  const msg = (error.message || '').toLowerCase()

  if (code === 'ERR_NETWORK' || msg.includes('network error')) {
    if (
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:' &&
      USE_DIRECT_API &&
      DIRECT_API.startsWith('http:')
    ) {
      return (
        'Mixed content blocked: this site is HTTPS but NEXT_PUBLIC_BACKEND_API is HTTP. ' +
        'Unset NEXT_PUBLIC_USE_DIRECT_API to use the /api/admin-bff proxy, or serve the API over HTTPS.'
      )
    }
    return (
      'Cannot reach the API. Using the default proxy: set ADMIN_BACKEND_INTERNAL_URL (e.g. http://127.0.0.1:5000/api) and restart Next.js; on Vercel set it to your live API URL including /api. ' +
      'Ensure the backend is running. If you use direct API mode, check CORS and NEXT_PUBLIC_BACKEND_API.'
    )
  }
  if (code === 'ECONNABORTED' || msg.includes('timeout')) {
    return 'Request timed out. Check that the backend is running and reachable.'
  }
  return error.message || 'Network error: Please check your internet connection'
}

api.interceptors.request.use(
  (request) => {
    const token = tokenStorage.getValue()
    if (token) {
      request.headers['x-auth-token'] = `${token}`
    }
    request.headers['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (request.data instanceof FormData) {
      delete request.headers['Content-Type']
    }

    return request
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const newAccessToken = readAuthTokenHeader(response.headers)
    if (newAccessToken) {
      tokenStorage.setValue(newAccessToken)
    }
    return response
  },
  async (error: AxiosError): Promise<never> => {
    if (!error.response) {
      return Promise.reject(new Error(describeNetworkFailure(error)))
    }

    if (
      typeof window !== 'undefined' &&
      [401, 403].includes(error.response.status) &&
      error.config &&
      !skipGlobalAuthRedirectOnError(error.config)
    ) {
      tokenStorage.removeValue()
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin'
      }
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api
