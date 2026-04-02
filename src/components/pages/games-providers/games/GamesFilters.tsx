'use client'

import { IProvider } from '@/api/games-providers'

interface GamesFiltersProps {
  providers: IProvider[]
  providerFilter: string
  statusFilter: string
  onProviderChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export default function GamesFilters({
  providers,
  providerFilter,
  statusFilter,
  onProviderChange,
  onStatusChange,
}: GamesFiltersProps) {
  return (
    <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
      <select
        value={providerFilter}
        onChange={(e) => onProviderChange(e.target.value)}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
      >
        <option value=''>All Providers</option>
        {providers.map((provider) => (
          <option key={provider._id} value={provider.name}>
            {provider.name}
          </option>
        ))}
      </select>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
      >
        <option value=''>All Status</option>
        <option value='active'>Active</option>
        <option value='inactive'>Inactive</option>
        <option value='hidden'>Hidden</option>
      </select>
    </div>
  )
}

