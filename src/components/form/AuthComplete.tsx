import debounce from 'lodash/debounce'
import React, { useEffect, useRef, useState } from 'react'

interface Option<T> {
  value: string
  label: string
  data: T
}

interface RenderOptionProps<T> {
  option: Option<T>
  isSelected: boolean
}

interface RenderSelectedItemProps<T> {
  item: T
  onRemove: () => void
}

interface AuthCompleteProps<T> {
  label: string
  defaultSelected?: T[]
  onChange?: (selected: T[]) => void
  disabled?: boolean
  placeholder?: string
  fetchOptions: (query: string) => Promise<T[]>
  minSearchLength?: number
  getOptionValue: (item: T) => string
  getOptionLabel: (item: T) => string
  renderOption?: (props: RenderOptionProps<T>) => React.ReactNode
  renderSelectedItem?: (props: RenderSelectedItemProps<T>) => React.ReactNode
  filterSelectedOptions?: boolean
  className?: string
  noResultsText?: string
  loadingText?: string
  typeToSearchText?: string
}

function AuthComplete<T>({
  label,
  defaultSelected = [],
  onChange,
  disabled = false,
  placeholder = 'Search...',
  fetchOptions,
  minSearchLength = 2,
  getOptionValue,
  getOptionLabel,
  renderOption,
  renderSelectedItem,
  filterSelectedOptions = true,
  className = '',
  noResultsText = 'No results found',
  loadingText = 'Loading...',
  typeToSearchText = 'Type to search',
}: AuthCompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<Option<T>[]>([])
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultSelected)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query.length >= minSearchLength) {
        setIsLoading(true)
        try {
          const items = await fetchOptions(query)
          const mappedOptions = items.map((item) => ({
            value: getOptionValue(item),
            label: getOptionLabel(item),
            data: item,
          }))
          setOptions(mappedOptions)
        } catch (error) {
          console.error('Error fetching options:', error)
          setOptions([])
        } finally {
          setIsLoading(false)
        }
      } else if (query.length === 0) {
        setOptions([])
      }
    }, 300)
  ).current

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const toggleDropdown = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
    if (!isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSelect = (option: Option<T>) => {
    const itemValue = getOptionValue(option.data)
    const itemExists = selectedItems.some(
      (item) => getOptionValue(item) === itemValue
    )

    let newSelectedItems
    if (itemExists) {
      newSelectedItems = selectedItems.filter(
        (item) => getOptionValue(item) !== itemValue
      )
    } else {
      newSelectedItems = [...selectedItems, option.data]
    }

    setSelectedItems(newSelectedItems)

    if (onChange) {
      onChange(newSelectedItems)
    }

    setSearchQuery('')
    inputRef.current?.focus()
  }

  const removeItem = (item: T) => {
    const itemValue = getOptionValue(item)
    const newSelectedItems = selectedItems.filter(
      (item) => getOptionValue(item) !== itemValue
    )
    setSelectedItems(newSelectedItems)

    if (onChange) {
      onChange(newSelectedItems)
    }
  }

  // Filter out already selected options if enabled
  const filteredOptions = filterSelectedOptions
    ? options.filter(
        (option) =>
          !selectedItems.some((item) => getOptionValue(item) === option.value)
      )
    : options

  // Default renderers
  const defaultRenderOption = ({
    option,
    isSelected,
  }: RenderOptionProps<T>) => (
    <div
      className={`relative flex w-full items-center p-2 pl-2 ${isSelected ? 'bg-primary/10' : ''}`}
    >
      <div className='font-medium text-gray-800 dark:text-white/90'>
        {option.label}
      </div>
    </div>
  )

  const defaultRenderSelectedItem = ({
    item,
    onRemove,
  }: RenderSelectedItemProps<T>) => (
    <div className='group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pr-2 pl-2.5 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800'>
      <span className='max-w-full flex-initial'>{getOptionLabel(item)}</span>
      <div className='flex flex-auto flex-row-reverse'>
        <div
          onClick={onRemove}
          className='cursor-pointer pl-2 text-gray-500 group-hover:text-gray-400 dark:text-gray-400'
        >
          <svg
            className='fill-current'
            role='button'
            width='14'
            height='14'
            viewBox='0 0 14 14'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z'
            />
          </svg>
        </div>
      </div>
    </div>
  )

  const selectedValues = selectedItems.map((item) => getOptionValue(item))

  return (
    <div className={`w-full ${className}`}>
      <label className='mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400'>
        {label}
      </label>

      <div className='relative z-20 inline-block w-full'>
        <div className='relative flex flex-col items-center'>
          <div className='w-full'>
            <div className='shadow-theme-xs focus:border-brand-300 focus:shadow-focus-ring dark:focus:border-brand-300 mb-2 flex h-auto rounded-lg border border-gray-300 py-1.5 pr-3 pl-3 outline-hidden transition dark:border-gray-700 dark:bg-gray-900'>
              <div className='flex flex-auto flex-wrap gap-2'>
                {selectedItems.length > 0 &&
                  selectedItems.map((item) => (
                    <React.Fragment key={getOptionValue(item)}>
                      {renderSelectedItem
                        ? renderSelectedItem({
                            item,
                            onRemove: () => removeItem(item),
                          })
                        : defaultRenderSelectedItem({
                            item,
                            onRemove: () => removeItem(item),
                          })}
                    </React.Fragment>
                  ))}
                <input
                  ref={inputRef}
                  placeholder={selectedItems.length > 0 ? '' : placeholder}
                  className='h-auto w-full appearance-none border-0 bg-transparent p-1 pr-2 text-sm text-gray-800 outline-hidden placeholder:text-gray-500 focus:border-0 focus:ring-0 focus:outline-hidden dark:text-white/90 dark:placeholder:text-gray-400'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsOpen(true)}
                  disabled={disabled}
                />
              </div>
              <div className='flex w-7 items-start py-1 pr-1 pl-1'>
                <button
                  type='button'
                  onClick={toggleDropdown}
                  className='h-5 w-5 cursor-pointer text-gray-700 outline-hidden focus:outline-hidden dark:text-gray-400'
                >
                  <svg
                    className={`stroke-current ${isOpen ? 'rotate-180' : ''}`}
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              ref={dropdownRef}
              className='max-h-select absolute top-full left-0 z-40 max-h-60 w-full overflow-y-auto rounded-lg bg-white shadow-lg shadow-white/30 dark:bg-gray-900'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex flex-col'>
                {isLoading ? (
                  <div className='flex items-center justify-center p-4 text-sm text-gray-500 dark:text-gray-400'>
                    <svg
                      className='mr-2 -ml-1 h-4 w-4 animate-spin text-gray-500 dark:text-gray-400'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    {loadingText}
                  </div>
                ) : searchQuery.length < minSearchLength ? (
                  <div className='p-3 text-sm text-gray-500 dark:text-gray-400'>
                    {typeToSearchText}{' '}
                    {minSearchLength > 1
                      ? `(at least ${minSearchLength} characters)`
                      : ''}
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className='p-3 text-sm text-gray-500 dark:text-gray-400'>
                    {noResultsText}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div key={option.value}>
                      <div
                        className='hover:bg-primary/5 w-full cursor-pointer border-b border-gray-200 dark:border-gray-800'
                        onClick={() => handleSelect(option)}
                      >
                        {renderOption
                          ? renderOption({
                              option,
                              isSelected: selectedValues.includes(option.value),
                            })
                          : defaultRenderOption({
                              option,
                              isSelected: selectedValues.includes(option.value),
                            })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthComplete
