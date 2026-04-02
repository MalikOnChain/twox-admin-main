export interface IPermission {
  _id: string
  key: string
  name: string
}

export interface IModulePermission {
  module: string
  view: boolean
  actions: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
    [key: string]: boolean
  }
}

export interface IDashboardCard {
  cardId: string
  visible: boolean
  position?: number
}

export interface IDataScope {
  brands?: string[]
  regions?: string[]
  limitType: 'all' | 'specific'
}

export interface IRole {
  _id: string
  name: string
  permissions: IPermission[] | string[]
  modulePermissions?: IModulePermission[]
  dashboardCards?: IDashboardCard[]
  dataScope?: IDataScope
  createdAt: Date
  updatedAt: Date
}

export interface IRoleCollection {
  _id: string
  name: string
  permissions: IPermission[]
  modulePermissions?: IModulePermission[]
  dashboardCards?: IDashboardCard[]
  dataScope?: IDataScope
  createdAt: Date
  updatedAt: Date
}

export interface IRolesListResponse {
  rows: IRoleCollection[]
  totalPages: number
  currentPage: number
  error?: any
}
