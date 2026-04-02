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
      errorData?.error || errorData?.message || defaultMessage,
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
