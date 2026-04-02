'use client'
import { useEffect, useState } from 'react'

type PillInputProps = {
  defaultPills: (string | number)[]
  onChange: (pills: (string | number)[]) => void
  type?: string
  maxPills?: number
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  success?: boolean
  error?: boolean
  hint?: string // Optional hint text
  errorMessage?: string
}

export default function PillInput({
  defaultPills,
  onChange,
  type = 'text',
  label,
  maxPills,
  placeholder = 'Type and press Enter',
  className = '',
  disabled = false,
  success = false,
  error = false,
  hint,
  errorMessage,
}: PillInputProps) {
  const [input, setInput] = useState('')
  const [pills, setPills] = useState<(string | number)[]>(defaultPills)

  const addPill = () => {
    const trimmed = type === 'number' ? Number(input.trim()) : input.trim()
    if (type === 'number' && isNaN(Number(trimmed))) {
      return
    }
    if (
      (trimmed || (type === 'number' && trimmed === 0)) &&
      !pills.includes(trimmed) &&
      pills.length < (maxPills || Infinity)
    ) {
      const newPills = [...pills, trimmed]
      onChange?.(newPills)
    }
    setInput('')
  }

  const removePill = (index: number) => {
    const newPills = pills.filter((_, i) => i !== index)
    onChange?.(newPills)
  }

  useEffect(() => {
    setPills(defaultPills)
  }, [defaultPills])

  // Determine input styles based on state (disabled, success, error)
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`

  // Add styles for the different states
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`
  } else if (success) {
    inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`
  }

  return (
    <div className='w-full'>
      {label && (
        <label className='mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400'>
          {label}
        </label>
      )}
      <div className='flex flex-wrap items-center gap-2'>
        <input
          type={type}
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              addPill()
            }
          }}
          className={inputClasses}
          disabled={disabled || pills.length >= (maxPills || Infinity)}
          onBlur={addPill}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='none'
        />
        {pills.map((pill, index) => (
          <div
            key={index}
            className='flex items-center rounded-full bg-blue-100 px-2 py-1 text-blue-800'
          >
            {pill}
            <span
              onClick={() => removePill(index)}
              className='ml-1 cursor-pointer text-sm font-bold hover:text-red-500'
            >
              ×
            </span>
          </div>
        ))}
        {/* Optional Hint Text */}
        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? 'text-error-500'
                : success
                  ? 'text-success-500'
                  : 'text-gray-500'
            }`}
          >
            {hint}
          </p>
        )}
        {error && (
          <p className='text-error-500 mt-1.5 text-xs'>{errorMessage}</p>
        )}
      </div>
    </div>
  )
}
