import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

import {
  CheckResult,
  CountryProps,
  ILogoResponse,
  SiteSettings,
} from '@/types/site-settings'

interface GetSiteSettingsResponse {
  settings: SiteSettings
  error?: string
}
export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const res = await api.get<GetSiteSettingsResponse>('/site-settings')
    return res.data.settings
  } catch (error) {
    handleApiError(error, 'Failed to get site settings')
  }
}

export const updateSiteSettings = async (
  data: SiteSettings
): Promise<SiteSettings> => {
  try {
    const res = await api.put<GetSiteSettingsResponse>('/site-settings', data)
    return res.data.settings
  } catch (error) {
    handleApiError(error, 'Failed to update site settings')
  }
}

interface CountryListResponse {
  countries: CountryProps[]
  error?: string
}

export const getCountries = async (): Promise<CountryProps[]> => {
  try {
    const res = await api.get<CountryListResponse>('/public/countries')
    return res.data.countries
  } catch (error) {
    handleApiError(error, 'Failed to get site settings')
  }
}

interface CheckResultResponse {
  result: CheckResult
  error?: string
}

export const checkIP = async (ip: string): Promise<CheckResult> => {
  try {
    const res = await api.get<CheckResultResponse>('/public/check-geo', {
      params: { ip },
    })
    return res.data.result
  } catch (error) {
    handleApiError(error, 'Failed to get site settings')
  }
}

export const uploadLogo = async (formData: FormData) => {
  try {
    const response = await api.post<ILogoResponse>(
      `/site-settings/update-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to upload promotion image')
  }
}
