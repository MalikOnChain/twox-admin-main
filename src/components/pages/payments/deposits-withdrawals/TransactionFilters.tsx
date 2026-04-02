'use client'

interface TransactionFiltersProps {
  filters: {
    method: string
    currency: string
    status: string
    country: string
  }
  onFilterChange: (filters: {
    method: string
    currency: string
    status: string
    country: string
  }) => void
}

export default function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
  return (
    <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-4'>
      <select
        value={filters.method}
        onChange={(e) => onFilterChange({ ...filters, method: e.target.value })}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
      >
        <option value=''>All Methods</option>
        <option value='pix'>PIX</option>
        <option value='payout_pix'>Payout PIX</option>
        <option value='nowpayments_crypto'>Crypto</option>
      </select>
      <select
        value={filters.currency}
        onChange={(e) => onFilterChange({ ...filters, currency: e.target.value })}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
      >
        <option value=''>All Currencies</option>
        <option value='BRL'>BRL</option>
        <option value='USD'>USD</option>
        <option value='EUR'>EUR</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
      >
        <option value=''>All Status</option>
        <option value='0'>Created</option>
        <option value='1'>Paid</option>
        <option value='3'>Expired/Rejected</option>
        <option value='4'>Refunded</option>
        <option value='5'>Waiting</option>
      </select>
      <input
        type='text'
        placeholder='Country'
        value={filters.country}
        onChange={(e) => onFilterChange({ ...filters, country: e.target.value })}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
      />
    </div>
  )
}

