import { Plus, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { InputSearch } from '@/components/common/InputSearch'
import Badge from '@/components/ui/badge/Badge'

export type Item = { value: string; label: string }

type Props = {
  /** All available options */
  options: Item[]
  /** Currently selected options */
  value: Item[]
  /** Called with new array of selected options */
  onChange: (options: Item[]) => void
  placeholder?: string
  /** Whether the items represent countries (will show flags if true) */
  isCountry?: boolean
}

export default function IPCountrySelect({
  options,
  value,
  onChange,
  isCountry = false,
}: Props) {
  const [selectedSearch, setSelectedSearch] = useState('')
  const [availableSearch, setAvailableSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Filter available options based on search
  const filteredAvailable = options
    .filter((i) => !value.find((v) => v.value === i.value))
    .filter((i) =>
      availableSearch.trim() === ''
        ? true
        : i.label.toLowerCase().includes(availableSearch.toLowerCase())
    )

  // Filter selected options based on search
  const filteredSelected = value.filter((i) =>
    selectedSearch.trim() === ''
      ? true
      : i.label.toLowerCase().includes(selectedSearch.toLowerCase())
  )

  // Add item
  const addItem = (item: Item) => {
    onChange([...value, item])
    setAvailableSearch('')
  }

  // Remove item
  const removeItem = (item: Item) =>
    onChange(value.filter((v) => v.value !== item.value))

  return (
    <div
      className='flex w-full flex-col justify-center gap-8 md:flex-row md:justify-center'
      ref={ref}
    >
      {/* Selected Items List */}
      <div className='flex w-full max-w-[500px] flex-col gap-2 sm:w-1/2'>
        <InputSearch
          className='w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500/20'
          placeholder='Search selected items...'
          value={selectedSearch}
          fetchData={(value) => setSelectedSearch(value)}
        />
        <div className='flex max-h-[600px] w-full flex-col gap-1 overflow-y-auto rounded-md border border-gray-400 p-4'>
          {filteredSelected.length === 0 ? (
            <div className='text-center text-gray-500'>
              No matching items found
            </div>
          ) : (
            filteredSelected.map((item) => (
              <div key={item.value} className='flex flex-wrap gap-2'>
                <Badge
                  variant='light'
                  color='success'
                  className='block min-h-8 max-w-xs break-words whitespace-normal'
                >
                  {isCountry && (
                    <Image
                      width={20}
                      height={20}
                      src={`https://flagpedia.net/data/flags/w40/${item.value.toLowerCase()}.png`}
                      alt={item.label}
                      className='mr-2 inline-block'
                    />
                  )}
                  {item.label}
                  <button
                    type='button'
                    className='ml-1 focus:outline-none'
                    onClick={() => removeItem(item)}
                  >
                    <X className='h-5 w-5 cursor-pointer font-bold text-red-400' />
                  </button>
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available Items List */}
      <div className='flex w-full max-w-[500px] flex-col gap-2 sm:w-1/2'>
        <InputSearch
          className='w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500/20'
          placeholder='Search available items...'
          value={availableSearch}
          fetchData={(value) => setAvailableSearch(value)}
        />
        <div className='flex max-h-[600px] w-full flex-col gap-1 overflow-y-auto rounded-md border border-gray-400 p-4'>
          {filteredAvailable.length === 0 ? (
            <div className='text-center text-gray-500'>
              No matching items found
            </div>
          ) : (
            filteredAvailable.map((item) => (
              <div key={item.value} className='flex flex-wrap gap-2'>
                <Badge
                  variant='light'
                  color='info'
                  className='block min-h-8 max-w-xs break-words whitespace-normal'
                >
                  {isCountry && (
                    <Image
                      width={20}
                      height={20}
                      src={`https://flagpedia.net/data/flags/w40/${item.value.toLowerCase()}.png`}
                      alt={item.label}
                      className='mr-2 inline-block'
                    />
                  )}
                  {item.label}
                  <button
                    type='button'
                    className='ml-1 focus:outline-none'
                    onClick={() => addItem(item)}
                  >
                    <Plus className='h-5 w-5 cursor-pointer font-bold text-green-400' />
                  </button>
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
