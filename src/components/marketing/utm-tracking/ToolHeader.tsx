import { RotateCcw } from 'lucide-react'
import Image from 'next/image'

import { getUtmSourceOptions } from '@/lib/utils'

import ToolTip from '@/components/common/ToolTip'
import Select from '@/components/form/Select'

import { GetUTMTrackingFilter } from '@/types/utm-track'

const UTM_SOURCE_OPTIONS = getUtmSourceOptions(true)

const ToolHeader = ({
  filter,
  handleReload,
  setFilter,
  promotions,
}: {
  filter: GetUTMTrackingFilter
  handleReload: () => void
  setFilter: (
    filter:
      | GetUTMTrackingFilter
      | ((prev: GetUTMTrackingFilter) => GetUTMTrackingFilter)
  ) => void
  promotions: any[]
}) => {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <ToolTip text='Reload'>
        <RotateCcw
          onClick={handleReload}
          className='cursor-pointer text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
        />
      </ToolTip>

      <div className='flex flex-wrap items-center gap-2'>
        {UTM_SOURCE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              setFilter((prev: GetUTMTrackingFilter) => ({
                ...prev,
                utm_source: option.value,
              }))
            }
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
              filter.utm_source === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {option.label === 'All' ? (
              <span>{option.label}</span>
            ) : (
              <Image
                src={option.icon}
                alt={option.label}
                width={20}
                height={20}
              />
            )}
          </button>
        ))}
      </div>

      <div className='w-full sm:w-fit'>
        <Select
          options={promotions.map((promotion) => ({
            label: promotion.name,
            value: promotion._id,
          }))}
          placeholder='Select an option'
          onChange={(value) =>
            setFilter((prev: GetUTMTrackingFilter) => ({
              ...prev,
              utm_campaign: value,
            }))
          }
          defaultValue={filter.utm_campaign}
          className='bg-gray-50 dark:bg-gray-800'
        />
      </div>
    </div>
  )
}

export default ToolHeader
