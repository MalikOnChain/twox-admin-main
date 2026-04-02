'use client'

interface DateRangeFilterProps {
  days: number
  onDaysChange: (days: number) => void
}

export default function DateRangeFilter({ days, onDaysChange }: DateRangeFilterProps) {
  return (
    <div className='mb-6'>
      <label className='mr-2 text-sm font-medium text-gray-400'>Date Range (Days)</label>
      <select
        value={days}
        onChange={(e) => onDaysChange(Number(e.target.value))}
        className='mt-2 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
      >
        <option value={7}>Last 7 days</option>
        <option value={14}>Last 14 days</option>
        <option value={30}>Last 30 days</option>
        <option value={60}>Last 60 days</option>
        <option value={90}>Last 90 days</option>
      </select>
    </div>
  )
}

