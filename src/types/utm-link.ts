export interface UTMLink {
  _id: string
  link: string
  utm_source: string
  utm_campaign: {
    _id: string
    name: string
    bonusId: {
      _id: string
      name: string
    }
  }
  utm_content: {
    title: string
    description: string
    image: string
    redirectUrl: string
  }
  createdAt: string
  updatedAt: string
}

export interface UTMLinkSuccessResponse {
  message?: string
  error?: string
}

export interface UTMLinkListResponse {
  rows: UTMLink[]
  pagination: {
    totalPages: number
    currentPage: number
    totalItems: number
  }
}
