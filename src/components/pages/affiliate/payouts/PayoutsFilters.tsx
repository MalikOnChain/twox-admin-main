'use client'

import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import { DownloadIcon } from '@/icons'
import { IPartner } from '@/api/affiliate-management'

interface PayoutsFiltersProps {
  partners: IPartner[]
  partnerId: string
  status: string
  startDate: string
  endDate: string
  onPartnerChange: (value: string) => void
  onStatusChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onExport: () => void
}

export default function PayoutsFilters({
  partners,
  partnerId,
  status,
  startDate,
  endDate,
  onPartnerChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onExport,
}: PayoutsFiltersProps) {
  return (
    <div className='mb-6 flex items-center justify-between gap-4'>
      <div className='flex gap-4'>
        <select
          value={partnerId}
          onChange={(e) => onPartnerChange(e.target.value)}
          className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value=''>All Partners</option>
          {partners.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value=''>All Statuses</option>
          <option value='pending'>Pending</option>
          <option value='approved'>Approved</option>
          <option value='paid'>Paid</option>
          <option value='cancelled'>Cancelled</option>
        </select>
        <Input
          type='date'
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          placeholder='Start Date'
          className='w-40'
        />
        <Input
          type='date'
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          placeholder='End Date'
          className='w-40'
        />
      </div>
      <Button size='xs' variant='outline' onClick={onExport}>
        <DownloadIcon />
        Export
      </Button>
    </div>
  )
}

