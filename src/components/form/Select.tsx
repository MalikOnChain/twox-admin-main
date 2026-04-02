import React, { useEffect, useState } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  options: Option[]
  placeholder?: string
  onChange: (value: string) => void
  className?: string
  defaultValue?: string
  disabled?: boolean
  error?: boolean // New prop: whether there is an error
  errorMessage?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  defaultValue = '',
  disabled = false,
  error = false,
  errorMessage = '',
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedValue(value)
    onChange(value) // Trigger parent handler
  }

  useEffect(() => {
    setSelectedValue(defaultValue)
  }, [defaultValue])

  return (
    <div>
      <select
        className={`shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${
          selectedValue
            ? 'text-gray-800 dark:text-white/90'
            : 'text-gray-400 dark:text-gray-400'
        } ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-gray-300 dark:border-gray-700'
        } ${className}`}
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
      >
        {/* Placeholder option */}
        <option
          value=''
          disabled
          className='text-gray-700 dark:bg-gray-900 dark:text-gray-400'
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className='relative text-gray-700 dark:bg-gray-900 dark:text-gray-400'
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && errorMessage && (
        <p
          id='select-error'
          className='mt-1 text-sm text-red-600 dark:text-red-500'
          role='alert'
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Select
