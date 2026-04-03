'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

import { exchangeToken, getCurrentUser } from '@/api/auth'

import storageHandler from '@/lib/storage-utils'

import { IAdmin } from '@/types/admin'
import { IRole } from '@/types/role'

export type ILoginUser = Omit<IAdmin, 'roles'> & { roles: IRole[] }

interface AuthContextType {
  isLoading: boolean
  user: ILoginUser
  setUser: React.Dispatch<React.SetStateAction<ILoginUser | null>>
  logout: () => Promise<void>
  getLoggedInUser: () => Promise<void>
  checkAuth: (identifier?: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const {
  getValue: getToken,
  setValue: setToken,
  removeValue: removeToken,
} = storageHandler({ key: 'token' })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ILoginUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const searchparams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [identifier, setIdentifier] = useState<string>('')

  const handleLogout = useCallback(() => {
    removeToken()
    window.location.href = '/signin'
  }, [])

  const checkAuth = useCallback(
    async (identifier?: string) => {
      try {
        if (!identifier) throw new Error('Identifier is not received')

        const { token: exchangedToken } = await exchangeToken(identifier)
        setToken(exchangedToken)
        const storedToken = getToken()
        if (!storedToken) {
          toast.error('Login failed: token was not stored.')
          throw new Error('Login failed: token was not stored.')
        }
        const user = await getCurrentUser()
        setUser(user)
        setIsAuthenticated(true)
        setIdentifier('')
        toast.success('Login successfully!')
      } catch (error) {
        handleLogout()
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Failed to get user')
        }
        throw error
      }
    },
    [handleLogout]
  )

  const getLoggedInUser = useCallback(async () => {
    try {
      const storedToken = getToken()
      if (!storedToken) {
        setIsLoading(false)
        return
      }
      const response = await getCurrentUser()
      setUser(response)
      setIsAuthenticated(true)
    } catch (error) {
      handleLogout()
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to get user')
      }
    }
    setIsLoading(false)
  }, [setIsLoading, handleLogout])

  const logout = useCallback(async () => {
    try {
      handleLogout()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to logout')
      }
    }
  }, [handleLogout])

  useEffect(() => {
    const identifier_param = searchparams.get('identifier')
    const warning_param = searchparams.get('warning')

    if (identifier_param) {
      setIdentifier(identifier_param)
    }

    if (warning_param) {
      toast.error(warning_param)
    }

    // if (typeof window !== 'undefined') {
    //   router.replace(window.location.pathname)
    // }
  }, [searchparams, router])

  useEffect(() => {
    if (identifier) {
      checkAuth(identifier)
    }
  }, [identifier, checkAuth])

  useEffect(() => {
    getLoggedInUser()
  }, [getLoggedInUser])

  const value = useMemo(
    () => ({
      isLoading,
      user,
      setUser,
      logout,
      checkAuth,
      getLoggedInUser,
      isAuthenticated,
    }),
    [
      isLoading,
      user,
      setUser,
      logout,
      checkAuth,
      getLoggedInUser,
      isAuthenticated,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook for using the user context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider')
  }
  return context
}
