export interface IApikeyData {
  _id?: string
  name: string
  label: string
  apiKey: string
  status: boolean
  expiryDate: Date
  createdBy: string | any
  scope: APIKeysFilterOptions
  history: IApikeyHistory[]
}

export interface IApikeyHistory {
  name: string
  label: string
  apiKey: string
  createdAt: Date
}

export interface IApikeyListResponse {
  success: boolean
  rows: IApikeyData[]
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}

export interface IApikeyUpdateResponse {
  success: boolean
  message?: string
}

export enum APIKeysFilterOptions {
  MainBackEnd = 'main-backend',
  MainFrontEnd = 'main-frontend',
  AdminBackEnd = 'admin-backend',
  AdminFrontEnd = 'admin-frontend',
}

export const scopeFilterOptions = [
  { value: APIKeysFilterOptions.MainFrontEnd, label: 'Main FrontEnd' },
  { value: APIKeysFilterOptions.MainBackEnd, label: 'Main BackEnd' },
  { value: APIKeysFilterOptions.AdminFrontEnd, label: 'Admin FrontEnd' },
  { value: APIKeysFilterOptions.AdminBackEnd, label: 'Admin BackEnd' },
]
