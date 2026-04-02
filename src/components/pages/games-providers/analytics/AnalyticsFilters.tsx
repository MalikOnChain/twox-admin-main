'use client'

interface AnalyticsFiltersProps {
  days: number
  limit: number
  onDaysChange: (days: number) => void
  onLimitChange: (limit: number) => void
}

export default function AnalyticsFilters({
  days,
  limit,
  onDaysChange,
  onLimitChange,
}: AnalyticsFiltersProps) {
  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
      <div>
        <label className='text-sm font-medium text-gray-400'>Date Range (Days)</label>
        <select
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      <div>
        <label className='text-sm font-medium text-gray-400'>Top Games Limit</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
          <option value={20}>Top 20</option>
        </select>
      </div>
    </div>
  )
}

