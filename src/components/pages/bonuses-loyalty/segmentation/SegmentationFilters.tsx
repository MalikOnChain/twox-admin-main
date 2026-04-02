'use client'

import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import { IFilterOptions } from '@/api/bonus-segmentation'

interface SegmentationFiltersProps {
  filters: {
    country: string
    vip: string
    risk: string
    currency: string
    provider: string
    gameCategory: string
    minBalance: string
    maxBalance: string
    depositFrequency: string
  }
  filterOptions: IFilterOptions | null
  onFilterChange: (key: string, value: string) => void
  onResetFilters: () => void
}

export default function SegmentationFilters({
  filters,
  filterOptions,
  onFilterChange,
  onResetFilters,
}: SegmentationFiltersProps) {
  return (
    <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>Filters</h3>
        <Button size='xs' variant='outline' onClick={onResetFilters}>
          Reset Filters
        </Button>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        <div>
          <Label>Country</Label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
            className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All Countries</option>
            {filterOptions?.countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>VIP Tier</Label>
          <select
            value={filters.vip}
            onChange={(e) => onFilterChange('vip', e.target.value)}
            className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All VIP Tiers</option>
            <option value='none'>None</option>
            {filterOptions?.vipTiers
              .filter((v) => v.name !== 'None')
              .map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.count})
                </option>
              ))}
          </select>
        </div>

        <div>
          <Label>Risk Level</Label>
          <select
            value={filters.risk}
            onChange={(e) => onFilterChange('risk', e.target.value)}
            className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All Risk Levels</option>
            {filterOptions?.riskLevels.map((r) => (
              <option key={r.name} value={r.name}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Provider</Label>
          <select
            value={filters.provider}
            onChange={(e) => onFilterChange('provider', e.target.value)}
            className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All Providers</option>
            {filterOptions?.providers.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Game Category</Label>
          <select
            value={filters.gameCategory}
            onChange={(e) => onFilterChange('gameCategory', e.target.value)}
            className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All Categories</option>
            {filterOptions?.categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Min Balance</Label>
          <Input
            type='number'
            value={filters.minBalance}
            onChange={(e) => onFilterChange('minBalance', e.target.value)}
            placeholder='Min balance'
          />
        </div>

        <div>
          <Label>Max Balance</Label>
          <Input
            type='number'
            value={filters.maxBalance}
            onChange={(e) => onFilterChange('maxBalance', e.target.value)}
            placeholder='Max balance'
          />
        </div>

        <div>
          <Label>Deposit Frequency</Label>
          <select
            value={filters.depositFrequency}
            onChange={(e) => onFilterChange('depositFrequency', e.target.value)}
            className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value=''>All Frequencies</option>
            {filterOptions?.depositFrequencies.map((f) => (
              <option key={f.name} value={f.name}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

