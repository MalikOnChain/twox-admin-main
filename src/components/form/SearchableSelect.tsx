'use client'
import { useEffect, useRef, useState } from 'react'

interface Option {
  value: string
  text: string
}

interface SearchableSelectProps {
  label?: string
  options: Option[]
  defaultSelected?: string
  onSelect?: (selected: string) => void
  placeholder?: string
}

export default function SearchableSelect({
  options,
  onSelect,
  defaultSelected,
  placeholder,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<Option | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const results = options.filter((opt) =>
      opt.text.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredOptions(results)
  }
  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === defaultSelected)
    if (selectedOption) {
      setSelected(selectedOption)
    } else {
      setSelected(null)
    }
  }, [options, defaultSelected])

  const handleOptionClick = (option: Option) => {
    setSelected(option)
    setIsOpen(false)
    onSelect(option.value) // Call the onSelect function with the selected option
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  useEffect(() => {
    setFilteredOptions(options)
  }, [isOpen, options])
  return (
    <div className='relative w-full max-w-xs' ref={containerRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full rounded-md border px-4 py-2 text-left text-gray-700 shadow-sm dark:text-gray-400'
      >
        {selected?.text || placeholder || 'Select an option'}
      </button>

      {isOpen && (
        <div className='shadow-theme-xs focus:border-brand-300 focus:shadow-focus-ring dark:focus:border-brand-300 absolute z-10 mt-1 mb-2 flex h-auto w-full flex-col rounded-lg border border-gray-300 py-1.5 pr-3 pl-3 outline-hidden transition dark:border-gray-700 dark:bg-gray-900'>
          <input
            type='text'
            placeholder='Search...'
            className='w-full border-b border-gray-200 px-3 py-2 text-gray-700 shadow-sm placeholder:text-slate-600 focus:outline-none dark:text-gray-400 dark:placeholder:text-slate-400'
            onChange={handleInputChange}
          />
          <ul className='max-h-40 overflow-y-auto'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, i) => (
                <li
                  key={i}
                  onClick={() => handleOptionClick(option)}
                  className='flex cursor-pointer justify-between border-transparent px-4 py-2 text-sm text-gray-800 hover:border-gray-200 hover:bg-gray-100 dark:text-white/90 dark:hover:border-gray-800 hover:dark:bg-gray-800'
                >
                  {option.text}
                  {option.value === defaultSelected && (
                    <span className='ml-2 text-green-500'>✓</span>
                  )}
                </li>
              ))
            ) : (
              <li className='px-4 py-2 text-gray-500'>No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
