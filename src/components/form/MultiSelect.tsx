import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface Option {
  value: string
  text: string
  selected: boolean
}

interface MultiSelectProps {
  label: string
  options: Option[]
  defaultSelected?: string[]
  onChange?: (selected: string[]) => void
  disabled?: boolean
  placeHolderText?: string
  className?: string
  dropDownClassName?: string
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
  className = '',
  placeHolderText = 'Select Option',
  dropDownClassName = '',
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultSelected)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectedOptions = () => {
      if (defaultSelected.length > 0) {
        setSelectedOptions(defaultSelected)
      }
    }
    handleSelectedOptions()
  }, [defaultSelected])

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const toggleDropdown = useCallback(() => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }, [disabled])

  const handleSelect = useCallback(
    (optionValue: string) => {
      const newSelectedOptions = selectedOptions.includes(optionValue)
        ? selectedOptions.filter((value) => value !== optionValue)
        : [...selectedOptions, optionValue]

      setSelectedOptions(newSelectedOptions)
      if (onChange) onChange(newSelectedOptions)
    },
    [selectedOptions, onChange]
  )

  const removeOption = useCallback(
    (event: React.MouseEvent, value: string) => {
      event.stopPropagation() // Prevent dropdown from toggling
      const newSelectedOptions = selectedOptions.filter((opt) => opt !== value)
      setSelectedOptions(newSelectedOptions)
      if (onChange) onChange(newSelectedOptions)
    },
    [selectedOptions, onChange]
  )

  const selectedValuesText = selectedOptions.map(
    (value) => options.find((option) => option.value === value)?.text || ''
  )

  return (
    <div className='w-full'>
      <label className='mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400'>
        {label}
      </label>

      <div
        ref={dropdownRef}
        className={cn('relative z-20 inline-block w-full', className)}
      >
        <div className='relative flex flex-col items-center'>
          <div
            onClick={toggleDropdown}
            className={`w-full ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <div
              className={cn(
                'shadow-theme-xs focus-within:border-brand-300 focus-within:shadow-focus-ring dark:focus-within:border-brand-300 mb-2 flex h-auto rounded-lg border border-gray-300 py-1.5 pr-3 pl-3 outline-hidden transition dark:border-gray-700 dark:bg-gray-900',
                isOpen &&
                  'border-brand-300 shadow-focus-ring dark:border-brand-300',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <div className='flex flex-auto flex-wrap gap-2'>
                {selectedValuesText.length > 0 ? (
                  selectedValuesText.map((text, index) => (
                    <div
                      key={`${selectedOptions[index]}-${index}`}
                      className='group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pr-2 pl-2.5 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800'
                    >
                      <span className='max-w-full flex-initial'>{text}</span>
                      <div className='flex flex-auto flex-row-reverse'>
                        <div
                          onClick={(e) =>
                            removeOption(e, selectedOptions[index])
                          }
                          className='cursor-pointer pl-2 text-gray-500 group-hover:text-gray-400 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
                          title={`Remove ${text}`}
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
                  ))
                ) : (
                  <div className='h-full w-full p-1 pr-2 text-sm text-gray-800 dark:text-white/90'>
                    <span className='text-gray-500 dark:text-gray-400'>
                      {placeHolderText}
                    </span>
                  </div>
                )}
              </div>
              <div className='flex w-7 items-center py-1 pr-1 pl-1'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleDropdown()
                  }}
                  disabled={disabled}
                  className='h-5 w-5 cursor-pointer text-gray-700 outline-hidden focus:outline-hidden disabled:cursor-not-allowed dark:text-gray-400'
                  aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
                >
                  <svg
                    className={`stroke-current transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
              className={cn(
                'max-h-select custom-scrollbar absolute top-full left-0 z-40 max-h-[200px] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg shadow-white/30 dark:border-gray-700 dark:bg-gray-900',
                dropDownClassName
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex flex-col'>
                {options.length > 0 ? (
                  options.map((option, index) => (
                    <div key={option.value}>
                      <div
                        className={cn(
                          'hover:bg-primary/5 w-full cursor-pointer border-b border-gray-200 transition-colors dark:border-gray-700',
                          index === options.length - 1 &&
                            'rounded-b-lg border-b-0',
                          index === 0 && 'rounded-t-lg'
                        )}
                        onClick={() => handleSelect(option.value)}
                      >
                        <div
                          className={cn(
                            'relative flex w-full items-center p-3 pl-4',
                            selectedOptions.includes(option.value)
                              ? 'bg-primary/10 text-primary-600 dark:text-primary-400'
                              : 'text-gray-800 dark:text-white/90'
                          )}
                        >
                          <div className='flex items-center'>
                            {selectedOptions.includes(option.value) && (
                              <svg
                                className='text-primary-600 dark:text-primary-400 mr-2 h-4 w-4'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            )}
                            <span className='leading-6'>{option.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='p-3 text-center text-gray-500 dark:text-gray-400'>
                    No options available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MultiSelect
