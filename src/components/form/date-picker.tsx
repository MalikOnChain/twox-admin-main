import flatpickr from 'flatpickr'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import { useEffect, useRef } from 'react'

import 'flatpickr/dist/plugins/monthSelect/style.css'
import 'flatpickr/dist/flatpickr.css'

import { cn } from '@/lib/utils'

import Label from './Label'
import { CalenderIcon } from '../../icons'

type PropsType = {
  id: string
  onChange?: flatpickr.Options.Hook | flatpickr.Options.Hook[]
  defaultDate?: flatpickr.Options.DateOption
  label?: string
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  mode?: 'month' | 'single' // extended
  disabled?: boolean
}

export default function DatePicker({
  id,
  onChange,
  label,
  defaultDate,
  placeholder,
  minDate,
  maxDate,
  mode = 'single',
  disabled = false,
}: PropsType) {
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMonthMode = mode === 'month'

    const fp = flatpickr(`#${id}`, {
      static: true,
      dateFormat: isMonthMode ? 'Y-m' : 'Y-m-d',
      defaultDate,
      onChange,
      minDate,
      maxDate,
      ...(isMonthMode && {
        plugins: [
          monthSelectPlugin({
            shorthand: true,
            dateFormat: 'Y-m',
            altFormat: 'F Y',
            theme: 'light',
          }),
        ],
      }),
    })

    flatpickrInstance.current = Array.isArray(fp) ? fp[0] : fp

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.flatpickr-calendar')
      ) {
        flatpickrInstance.current?.close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy()
      }
    }
  }, [mode, onChange, id, defaultDate, minDate, maxDate])

  return (
    <div ref={wrapperRef}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className='relative'>
        <input
          id={id}
          placeholder={placeholder}
          className={cn(
            'shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/20 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
            disabled && 'opacity-50'
          )}
        />

        <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
          <CalenderIcon className='size-6' />
        </span>
      </div>
    </div>
  )
}
