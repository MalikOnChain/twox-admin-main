'use client'
import { IPlayerListFilters } from '@/api/user-management'
import DatePicker from '@/components/form/date-picker'

interface PlayerListFiltersProps {
  filters: IPlayerListFilters
  vipTiers: Array<{ name: string }>
  onFilterChange: (key: keyof IPlayerListFilters, value: any) => void
}

export default function PlayerListFilters({
  filters,
  vipTiers,
  onFilterChange,
}: PlayerListFiltersProps) {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h2 className='mb-4 text-xl font-semibold text-gray-800 dark:text-white/90'>
        Player List Filters
      </h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Country
          </label>
          <input
            type='text'
            placeholder='Filter by country'
            value={filters.country || ''}
            onChange={(e) => onFilterChange('country', e.target.value || undefined)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            VIP Tier
          </label>
          <select
            value={filters.vip || ''}
            onChange={(e) => onFilterChange('vip', e.target.value || undefined)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All</option>
            {vipTiers.map((tier) => (
              <option key={tier.name} value={tier.name}>
                {tier.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            KYC Status
          </label>
          <select
            value={filters.kyc || ''}
            onChange={(e) => onFilterChange('kyc', e.target.value || undefined)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All</option>
            <option value='pending'>Pending</option>
            <option value='completed'>Completed</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Risk Level
          </label>
          <select
            value={filters.risk || ''}
            onChange={(e) => onFilterChange('risk', e.target.value || undefined)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All</option>
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Balance Min
          </label>
          <input
            type='number'
            placeholder='Min balance'
            value={filters.balanceMin || ''}
            onChange={(e) =>
              onFilterChange('balanceMin', e.target.value ? Number(e.target.value) : undefined)
            }
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Balance Max
          </label>
          <input
            type='number'
            placeholder='Max balance'
            value={filters.balanceMax || ''}
            onChange={(e) =>
              onFilterChange('balanceMax', e.target.value ? Number(e.target.value) : undefined)
            }
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value || undefined)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All</option>
            <option value='active'>Active</option>
            <option value='banned'>Banned</option>
          </select>
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Search
          </label>
          <input
            type='text'
            placeholder='Username or email'
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value || undefined)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          />
        </div>
      </div>
      <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Join Date From
          </label>
          <DatePicker
            id='join-date-from'
            placeholder='From date'
            onChange={(dates) => {
              if (dates && dates.length > 0) {
                onFilterChange('joinDateFrom', dates[0].toISOString().split('T')[0])
              } else {
                onFilterChange('joinDateFrom', undefined)
              }
            }}
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Join Date To
          </label>
          <DatePicker
            id='join-date-to'
            placeholder='To date'
            onChange={(dates) => {
              if (dates && dates.length > 0) {
                onFilterChange('joinDateTo', dates[0].toISOString().split('T')[0])
              } else {
                onFilterChange('joinDateTo', undefined)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

