// lib/errorHandler.ts
import axios, { AxiosError } from 'axios'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const HTML_RESPONSE_HINT =
  'The server returned a web page instead of API JSON. In Vercel (or .env), set NEXT_PUBLIC_BACKEND_API to your backend base URL including /api (e.g. https://api.example.com/api)—not this admin site URL.'

function looksLikeHtmlPayload(s: string): boolean {
  const t = s.trim().toLowerCase()
  return t.startsWith('<!doctype') || t.startsWith('<html')
}

function messageFromResponseData(
  data: unknown,
  status: number | undefined,
  fallback: string
): string {
  if (data == null) {
    return status ? `${fallback} (HTTP ${status})` : fallback
  }
  if (typeof data === 'string') {
    const t = data.trim()
    if (looksLikeHtmlPayload(t)) {
      return HTML_RESPONSE_HINT
    }
    if (t.startsWith('{')) {
      try {
        const p = JSON.parse(t) as { error?: string; message?: string }
        return p.error || p.message || fallback
      } catch {
        return t.slice(0, 240) || fallback
      }
    }
    return t.slice(0, 240) || fallback
  }
  if (typeof data === 'object' && !Array.isArray(data)) {
    const o = data as Record<string, unknown>
    const e = o.error
    const m = o.message
    if (typeof e === 'string' && e) return e
    if (typeof m === 'string' && m) return m
  }
  return status ? `${fallback} (HTTP ${status})` : fallback
}

export const handleApiError = (
  error: unknown,
  defaultMessage = 'An unexpected error occurred'
): never => {
  // Handle Axios errors - check both instanceof and duck typing
  if (
    axios.isAxiosError(error) ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ERR_NETWORK' &&
      'name' in error &&
      error.name === 'AxiosError')
  ) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>

    // Handle network errors specifically
    if (axiosError.code === 'ERR_NETWORK') {
      throw new ApiError(axiosError.message || 'Network error occurred', 0)
    }

    const errorData = axiosError.response?.data
    const statusCode = axiosError.response?.status

    throw new ApiError(
      messageFromResponseData(errorData, statusCode, defaultMessage),
      statusCode
    )
  }

  // Handle standard errors
  if (error instanceof Error) {
    throw new ApiError(error.message)
  }

  // Handle unknown errors
  throw new ApiError(defaultMessage)
}

// Type guard to check if an error is an ApiError
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}

// Helper function to extract error message for display
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
