'use client'

import { useMemo } from 'react'

import { useSidebar } from '@/context/SidebarContext'

import AppHeader from '@/layout/AppHeader'
import AppSidebar from '@/layout/AppSidebar'
import Backdrop from '@/layout/Backdrop'

export default function AdminLayout({ children }: React.PropsWithChildren) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = useMemo(() => {
    if (isMobileOpen) return 'ml-0'

    if (isExpanded || isHovered) return 'lg:ml-[290px]'

    return 'lg:ml-[90px]'
  }, [isMobileOpen, isExpanded, isHovered])

  return (
    <div className='min-h-screen xl:flex'>
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />

        {/* Page Content */}
        <main className='mx-auto min-h-[calc(100vh-76px)] max-w-[var(--breakpoint-2xl)] p-4 md:p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}
