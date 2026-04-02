'use client'

interface ProviderFiltersProps {
  searchFilter: string
  codeFilter: string
  days: number
  onSearchChange: (value: string) => void
  onCodeChange: (value: string) => void
  onDaysChange: (days: number) => void
}

export default function ProviderFilters({
  searchFilter,
  codeFilter,
  days,
  onSearchChange,
  onCodeChange,
  onDaysChange,
}: ProviderFiltersProps) {
  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div>
        <label className='text-sm font-medium text-gray-400 mb-2 block'>
          Search Provider Name
        </label>
        <input
          type='text'
          value={searchFilter}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search by provider name...'
          className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        />
      </div>
      <div>
        <label className='text-sm font-medium text-gray-400 mb-2 block'>
          Filter by Code
        </label>
        <input
          type='text'
          value={codeFilter}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder='Filter by provider code...'
          className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        />
      </div>
      <div>
        <label className='text-sm font-medium text-gray-400 mb-2 block'>
          Date Range (Days)
        </label>
        <select
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
    </div>
  )
}

