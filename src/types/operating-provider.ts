export interface IOperatingProvider {
  _id: string
  name: string
  description: string
  metadata: any
  totalAmount?: number
}

export interface IOperatingProviderInvoice {
  _id: string
  providerId: string
  issueDate: string
  amount: number
  description: string
  createdAt: string
  updatedAt: string
}
