'use client'

import Button from '@/components/ui/button/Button'
import { PlusIcon } from '@/icons'
import { IPartner } from '@/api/affiliate-management'

interface DealsFiltersProps {
  partners: IPartner[]
  partnerId: string
  status: string
  onPartnerChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCreateDeal: () => void
}

export default function DealsFilters({
  partners,
  partnerId,
  status,
  onPartnerChange,
  onStatusChange,
  onCreateDeal,
}: DealsFiltersProps) {
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
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
          <option value='expired'>Expired</option>
        </select>
      </div>
      <Button size='xs' onClick={onCreateDeal}>
        <PlusIcon />
        Create Deal
      </Button>
    </div>
  )
}

