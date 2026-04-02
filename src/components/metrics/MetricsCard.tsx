import React, { ReactNode } from 'react'

import ToolTip from '@/components/common/ToolTip'

import { InfoIcon, PencilIcon } from '@/icons'

interface MetricsCardProps {
  title: string
  value: string | number | ReactNode
  tooltipText?: string
  className?: string
  onEdit?: () => void
  hasEdit?: boolean
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  tooltipText,
  className = '',
  onEdit,
  hasEdit = false,
}) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] ${className}`}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
          {title}
        </h3>
        <div className='flex gap-2'>
          {hasEdit && (
            <button onClick={onEdit}>
              <PencilIcon className='text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400' />
            </button>
          )}
          {tooltipText && (
            <ToolTip text={tooltipText}>
              <InfoIcon className='text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400' />
            </ToolTip>
          )}
        </div>
      </div>
      <div className='mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
        {value}
      </div>
    </div>
  )
}

export default MetricsCard
