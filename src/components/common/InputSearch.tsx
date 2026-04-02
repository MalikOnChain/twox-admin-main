'use client'

import { useEffect, useState } from 'react'

import { useDebounce } from '@/hooks/useDebounce'

import { ClearIcon, SearchIcon } from '@/icons'

type InputSearchProps = {
  placeholder?: string
  className?: string
  fetchData: (e: any) => void
  value?: string
  ref?: React.RefObject<HTMLInputElement>
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export const InputSearch = ({
  placeholder = 'Search...',
  className,
  fetchData,
  value = '',
  ref,
  onKeyDown,
  onFocus,
}: InputSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value)
  const debouncedSearchTerm = useDebounce(searchTerm)

  // Handle input change
  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    fetchData(debouncedSearchTerm)
  }, [debouncedSearchTerm, fetchData])

  return (
    <div className='relative'>
      <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500'>
        <SearchIcon />
      </span>
      <input
        ref={ref}
        type='text'
        className={`shadow-theme-xs focus:border-primary-500 dark:focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-gray-700 focus:ring-0 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 ${className}`}
        placeholder={placeholder}
        onChange={handleInputChange}
        value={searchTerm}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      />

      {searchTerm && (
        <button
          className='bg-primary-500 absolute top-0 right-0 h-full rounded-r-lg px-4 text-gray-500'
          onClick={() => {
            setSearchTerm('')
          }}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  )
}
