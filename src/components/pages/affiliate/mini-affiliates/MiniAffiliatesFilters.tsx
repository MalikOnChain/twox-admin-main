'use client'

import Input from '@/components/form/input/InputField'

interface MiniAffiliatesFiltersProps {
  search: string
  status: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export default function MiniAffiliatesFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: MiniAffiliatesFiltersProps) {
  return (
    <div className='mb-6 flex items-center gap-4'>
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder='Search by referral code...'
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
    </div>
  )
}

