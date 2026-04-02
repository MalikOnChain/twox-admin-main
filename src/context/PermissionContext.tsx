'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useAuth } from '@/context/AuthContext'

import Spinner from '@/components/common/Spinner'

import { navItems } from '@/layout/AppSidebar'

interface IPermissionContext {
  allowedRoutes: string[]
}
const PermissionContext = createContext<IPermissionContext | undefined>(
  undefined
)

const signinRoute = '/signin'
const publicRoutes = [signinRoute, '/verify', '/reset-password', '/error-404']

export function PermissionProvider({ children }: React.PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading: isAuthLoading, user } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const allRoutes = useMemo(() => {
    const routes = []
    for (const item of navItems) {
      if (item.subItems) {
        routes.push(...item.subItems)
      } else {
        routes.push(item)
      }
    }

    return routes
  }, [])

  const allowedRoutes = useMemo(() => {
    if (!user) return []

    const routes = allRoutes.filter((route) =>
      route.permissions?.some((permission: string) =>
        user.permissions.includes(permission)
      )
    )

    const paths = routes.map((route) => route.path)
    return [...new Set(paths)]
  }, [user, allRoutes])

  const isRouteAllowed = useCallback(
    (path: string) => {
      return allowedRoutes.some((allowedPath) => path.startsWith(allowedPath))
    },
    [allowedRoutes]
  )

  useEffect(() => {
    if (isAuthLoading) return

    if (!user && !publicRoutes.includes(pathname)) {
      setIsRedirecting(true)
      router.replace(signinRoute)
      return
    }

    if (user && (pathname === signinRoute || !isRouteAllowed(pathname))) {
      if (allowedRoutes.length > 0) {
        setIsRedirecting(true)
        router.replace(allowedRoutes[0])
        return
      }
    }

    setIsRedirecting(false)
  }, [isAuthLoading, user, pathname, router, allowedRoutes, isRouteAllowed])

  if (
    isAuthLoading ||
    isRedirecting ||
    (!publicRoutes.includes(pathname) && !isRouteAllowed(pathname))
  )
    return <Spinner />

  return (
    <PermissionContext.Provider value={{ allowedRoutes }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermission() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider')
  }
  return context
}
