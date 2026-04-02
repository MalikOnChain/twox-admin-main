'use client'

import { useMemo } from 'react'

import { useSidebar } from '@/context/SidebarContext'

import AffiliateHeader from '@/layout/AffiliateHeader'
import AffiliateSidebar from '@/layout/AffiliateSidebar'
import Backdrop from '@/layout/Backdrop'

export default function AdminLayout({ children }: React.PropsWithChildren) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  // Calculate main content margin dynamically
  const mainContentMargin = useMemo(() => {
    if (isMobileOpen) return 'ml-0'
    return isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
  }, [isMobileOpen, isExpanded, isHovered])

  return (
    <div className='min-h-screen xl:flex'>
      {/* Sidebar and Backdrop */}
      <AffiliateSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AffiliateHeader />

        {/* Page Content */}
        <main className='mx-auto min-h-[calc(100vh-64px)] max-w-[var(--breakpoint-2xl)] p-4 md:p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}
