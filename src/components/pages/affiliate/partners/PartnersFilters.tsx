'use client'

import Input from '@/components/form/input/InputField'
import Button from '@/components/ui/button/Button'
import { DownloadIcon } from '@/icons'

interface PartnersFiltersProps {
  search: string
  status: string
  days: number
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onDaysChange: (value: number) => void
  onExport: () => void
}

export default function PartnersFilters({
  search,
  status,
  days,
  onSearchChange,
  onStatusChange,
  onDaysChange,
  onExport,
}: PartnersFiltersProps) {
  return (
    <div className='mb-6 flex items-center justify-between gap-4'>
      <div className='flex gap-4'>
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search partners...'
          className='w-64'
        />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value=''>All Statuses</option>
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
          <option value='suspended'>Suspended</option>
        </select>
        <select
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={180}>Last 180 days</option>
        </select>
      </div>
      <Button size='xs' variant='outline' onClick={onExport}>
        <DownloadIcon />
        Export
      </Button>
    </div>
  )
}

