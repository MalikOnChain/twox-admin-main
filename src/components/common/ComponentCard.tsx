import Link from 'next/link'
import React from 'react'

import { ChevronLeftIcon } from '@/icons'

interface ComponentCardProps {
  title: string
  children: React.ReactNode
  className?: string // Additional custom classes for styling
  desc?: string // Description text
  inputSearchElement?: React.ReactNode
  tabs?: React.ReactNode
  action?: React.ReactNode
  backUrl?: string
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = '',
  desc = '',
  inputSearchElement,
  tabs,
  action,
  backUrl,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className='grid grid-cols-12 items-center px-6 py-5'>
        <div className='col-span-12 md:col-span-8'>
          <div className='flex gap-6'>
            <h3 className='flex items-center gap-1 text-base font-medium text-gray-800 dark:text-white/90'>
              {backUrl && (
                <Link
                  href={backUrl}
                  className='flex items-center text-gray-500 dark:text-gray-400'
                >
                  <ChevronLeftIcon className='h-5 w-5' />
                </Link>
              )}
              {title}
            </h3>
            {tabs && <>{tabs}</>}
          </div>
          {desc && (
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {desc}
            </p>
          )}
        </div>

        {(inputSearchElement || action) && (
          <div className='col-span-12 flex justify-end gap-2 md:col-span-4'>
            {inputSearchElement}
            {action && action}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className='border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800'>
        <div className='space-y-6'>{children}</div>
      </div>
    </div>
  )
}

export default ComponentCard
