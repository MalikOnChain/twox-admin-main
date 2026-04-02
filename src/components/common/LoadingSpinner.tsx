import React from 'react'

import { cn } from '@/lib/utils'

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'h-10 w-10 animate-spin rounded-full border-4 border-gray-800 border-t-blue-500',
        className
      )}
    />
  )
}

export default LoadingSpinner
