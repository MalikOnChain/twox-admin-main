import { ChevronDown, ChevronUp } from 'lucide-react'
import { memo, useCallback, useState } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string

  // New props for conditional functionality
  isToggleable?: boolean
  isEnabled?: boolean
  onToggle?: (enabled: boolean) => void

  // Collapsible functionality
  isCollapsible?: boolean
  defaultCollapsed?: boolean

  // Switch configuration
  switchLabel?: string
  switchDescription?: string
}

const SectionCard = ({
  title,
  subtitle,
  icon,
  children,
  className = '',

  // Toggle functionality
  isToggleable = false,
  isEnabled = true,
  onToggle,

  // Collapsible functionality
  isCollapsible = false,
  defaultCollapsed = false,

  // Switch configuration
  switchLabel = 'Enable Section',
  switchDescription,
}: SectionCardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const handleToggle = useCallback(
    (enabled: boolean) => {
      onToggle?.(enabled)
    },
    [onToggle]
  )

  const handleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  const showContent = isToggleable ? isEnabled : true
  const shouldShowSwitch = isToggleable && onToggle

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-white/[0.03] ${
        isToggleable && !isEnabled ? 'opacity-60' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-700'>
        <div className='flex items-center gap-3'>
          {icon && (
            <div
              className={`rounded-lg p-2 transition-colors ${
                isToggleable && !isEnabled
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}
            >
              <span
                className={`transition-colors ${
                  isToggleable && !isEnabled
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {icon}
              </span>
            </div>
          )}
          <div className='flex-1'>
            <div className='flex items-center gap-3'>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                {title}
              </h4>

              {/* Toggle Switch */}
              {shouldShowSwitch && (
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    role='switch'
                    aria-checked={isEnabled}
                    aria-label={switchLabel}
                    onClick={() => handleToggle(!isEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900 ${
                      isEnabled
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  {switchDescription && (
                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                      {switchDescription}
                    </span>
                  )}
                </div>
              )}
            </div>

            {subtitle && (
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        {isCollapsible && showContent && (
          <button
            type='button'
            onClick={handleCollapse}
            className='ml-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300'
            aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            {isCollapsed ? (
              <ChevronDown className='h-5 w-5' />
            ) : (
              <ChevronUp className='h-5 w-5' />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {showContent && (
        <div
          className={`transition-all duration-300 ease-in-out ${
            isCollapsible && isCollapsed
              ? 'max-h-0 overflow-hidden opacity-0'
              : 'max-h-none opacity-100'
          }`}
        >
          <div className='grid grid-cols-1 gap-6 px-6 pt-2 pb-6'>
            {children}
          </div>
        </div>
      )}

      {/* Empty State when disabled */}
      {isToggleable && !isEnabled && (
        <div className='px-6 pt-2 pb-6'>
          <div className='flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 dark:border-gray-700'>
            <div className='text-center'>
              <div className='text-gray-400 dark:text-gray-600'>
                <svg
                  className='mx-auto h-12 w-12'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-7 7-7-7'
                  />
                </svg>
              </div>
              <h3 className='mt-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                {title} is disabled
              </h3>
              <p className='mt-2 text-sm text-gray-400 dark:text-gray-600'>
                Enable {title.toLowerCase()} to configure settings
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(SectionCard)
