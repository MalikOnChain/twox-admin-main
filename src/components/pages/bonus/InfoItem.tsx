import { Check, X } from 'lucide-react'
import React, { memo, useCallback, useEffect, useState } from 'react'

import DatePicker from '@/components/form/date-picker'
import Input from '@/components/form/input/InputField'
import Radio from '@/components/form/input/Radio'
import TextArea from '@/components/form/input/TextArea'
import MultiSelect from '@/components/form/MultiSelect'
import Select from '@/components/form/Select'
import Badge from '@/components/ui/badge/Badge'

// Enhanced InfoItem with always-visible inputs and conditional save/cancel buttons
const EditableInfoItem = ({
  label,
  value,
  icon,
  type = 'text',
  options = [],
  onChange,
  validation,
  multiline = false,
  placeholder = '',
  disabled = false,
}: {
  label: string
  value: any
  icon?: React.ReactNode
  highlight?: boolean
  type?:
    | 'text'
    | 'number'
    | 'select'
    | 'boolean'
    | 'date'
    | 'dateRange'
    | 'currency'
    | 'textarea'
    | 'multiselect'
  options?: Array<{ label: string; value: any }>
  onChange?: (newValue: any) => void
  validation?: (value: any) => string | null
  multiline?: boolean
  placeholder?: string
  disabled?: boolean
  fromPlaceholder?: string
  toPlaceholder?: string
}) => {
  const [editValue, setEditValue] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setEditValue(value)
    setHasChanges(false)
  }, [value])

  // Check if current value differs from original
  useEffect(() => {
    const isDifferent = JSON.stringify(editValue) !== JSON.stringify(value)
    setHasChanges(isDifferent)
  }, [editValue, value])

  const handleSave = useCallback(() => {
    if (validation) {
      const validationError = validation(editValue)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setError(null)
    onChange?.(editValue)
    setHasChanges(false)
  }, [editValue, validation, onChange])

  const handleCancel = useCallback(() => {
    setEditValue(value)
    setError(null)
    setHasChanges(false)
  }, [value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !multiline && hasChanges) {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleSave, handleCancel, multiline, hasChanges]
  )

  const handleInputChange = (newValue: any) => {
    setEditValue(newValue)
    setError(null) // Clear error when user starts typing
  }

  const handleDateFromChange = (dates: Date[]) => {
    const newValue = { ...editValue }
    if (dates.length > 0) {
      const date = new Date(dates[0])
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0]
      newValue.from = formattedDate
    } else {
      newValue.from = null
    }
    handleInputChange(newValue)
  }

  const handleDateToChange = (dates: Date[]) => {
    const newValue = { ...editValue }
    if (dates.length > 0) {
      const date = new Date(dates[0])
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0]
      newValue.to = formattedDate
    } else {
      newValue.to = null
    }
    handleInputChange(newValue)
  }

  const renderInput = () => {
    const baseClasses = `w-full ml-1 max-w-[650px] ${
      error
        ? 'border-red-500 bg-red-50'
        : hasChanges
          ? 'border-blue-300 bg-blue-50'
          : 'border-gray-300 bg-white'
    } bg-transparent dark:border-gray-600 dark:text-white`

    switch (type) {
      case 'dateRange':
        return (
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-4'>
              <DatePicker
                id='date-from'
                placeholder='Date From'
                onChange={handleDateFromChange}
                maxDate={
                  editValue?.to
                    ? new Date(editValue.to + 'T00:00:00')
                    : undefined
                }
              />

              <span className='text-sm text-gray-500'>→</span>
              <DatePicker
                id='date-to'
                placeholder='Date To'
                onChange={handleDateToChange}
                minDate={
                  editValue?.from
                    ? new Date(editValue.from + 'T00:00:00')
                    : undefined
                }
              />
            </div>
          </div>
        )

      case 'textarea':
        return (
          <TextArea
            value={editValue || ''}
            onChange={(value) => handleInputChange(value)}
            className={baseClasses}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
          />
        )

      case 'select':
        return (
          <Select
            defaultValue={editValue || ''}
            onChange={(value) => handleInputChange(value)}
            options={options}
            className={baseClasses}
            disabled={disabled}
            error={!!error}
          />
        )

      case 'boolean':
        return (
          <div className='flex items-center gap-4'>
            <Radio
              id={`${label}-yes`}
              name={`${label}-boolean`}
              value='true'
              checked={editValue === true}
              onChange={() => handleInputChange(true)}
              label='Yes'
              disabled={disabled}
            />
            <Radio
              id={`${label}-no`}
              name={`${label}-boolean`}
              value='false'
              checked={editValue === false}
              onChange={() => handleInputChange(false)}
              label='No'
              disabled={disabled}
            />
          </div>
        )

      case 'multiselect':
        return (
          <MultiSelect
            label=''
            options={options.map((opt) => ({
              value: opt.value,
              text: opt.label,
              selected: false,
            }))}
            defaultSelected={editValue || []}
            onChange={(value) => handleInputChange(value)}
            className={baseClasses}
            disabled={disabled}
          />
        )

      case 'number':
      case 'currency':
        return (
          <Input
            type='number'
            value={editValue || ''}
            onChange={(e) =>
              handleInputChange(
                type === 'currency'
                  ? parseFloat(e.target.value) || 0
                  : e.target.value
              )
            }
            onKeyDown={handleKeyDown}
            className={baseClasses}
            placeholder={placeholder}
            disabled={disabled}
            step={type === 'currency' ? 0.01 : 1}
            min='0'
            error={!!error}
          />
        )

      case 'date':
        return (
          <Input
            type='date'
            value={
              editValue ? new Date(editValue).toISOString().split('T')[0] : ''
            }
            onChange={(e) =>
              handleInputChange(
                e.target.value ? new Date(e.target.value).toISOString() : ''
              )
            }
            onKeyDown={handleKeyDown}
            className={baseClasses}
            disabled={disabled}
            error={!!error}
          />
        )

      default:
        return (
          <Input
            type='text'
            value={editValue || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={baseClasses}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
          />
        )
    }
  }

  return (
    <div className='rounded-lg'>
      <div className='mb-2 flex items-center gap-2'>
        <Badge className='text-xs font-medium' color='success'>
          {label}
        </Badge>
        {icon && (
          <span className='text-gray-500 dark:text-gray-400'>{icon}</span>
        )}
      </div>

      <div className='space-y-2'>
        {renderInput()}

        {error && (
          <div className='text-xs text-red-600 dark:text-red-400'>{error}</div>
        )}

        {hasChanges && !disabled && (
          <div className='animate-in fade-in flex items-center gap-2 duration-200'>
            <button
              onClick={handleSave}
              className='flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:outline-none'
            >
              <Check size={12} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className='flex items-center gap-1 rounded bg-gray-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:outline-none'
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(EditableInfoItem)
