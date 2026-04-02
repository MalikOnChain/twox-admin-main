import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils'

// Context to share active tab state
interface TabsContextType {
  activeValue: string | undefined
  setActiveValue: (value: string) => void
  variant: 'default' | 'pills' | 'underline' | 'cards'
  size: 'sm' | 'md' | 'lg'
  orientation: 'horizontal' | 'vertical'
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

// Custom hook to use tabs context
const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// Tabs: provides context for children
interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children: ReactNode
}

export const Tabs: FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className,
  children,
}) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    controlledValue || defaultValue
  )

  const isControlled = controlledValue !== undefined
  const activeValue = isControlled ? controlledValue : internalValue

  const setActiveValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  useEffect(() => {
    if (isControlled) {
      setInternalValue(controlledValue)
    }
  }, [controlledValue, isControlled])

  return (
    <TabsContext.Provider
      value={{
        activeValue,
        setActiveValue,
        variant,
        size,
        orientation,
      }}
    >
      <div
        className={cn(
          'w-full',
          orientation === 'vertical' && 'flex gap-6',
          className
        )}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// TabsList: container for tab triggers
interface TabsListProps {
  className?: string
  children: ReactNode
}

export const TabsList: FC<TabsListProps> = ({ className, children }) => {
  const { variant, size, orientation } = useTabsContext()
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
  const listRef = useRef<HTMLDivElement>(null)

  const updateIndicator = useCallback(() => {
    if (!listRef.current || variant === 'pills' || variant === 'cards') return

    const activeTab = listRef.current.querySelector(
      '[data-state="active"]'
    ) as HTMLElement
    if (!activeTab) {
      setIndicatorStyle({ opacity: 0 })
      return
    }

    const listRect = listRef.current.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()

    if (orientation === 'horizontal') {
      setIndicatorStyle({
        left: tabRect.left - listRect.left,
        width: tabRect.width,
        opacity: 1,
        transform: 'translateY(0)',
      })
    } else {
      setIndicatorStyle({
        top: tabRect.top - listRect.top,
        height: tabRect.height,
        opacity: 1,
        transform: 'translateX(0)',
      })
    }
  }, [variant, orientation])

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      updateIndicator()
    })

    const observer = new ResizeObserver(updateIndicator)
    if (listRef.current) {
      observer.observe(listRef.current)
    }

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [updateIndicator])

  // Update indicator when activeValue changes
  const { activeValue } = useTabsContext()
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      updateIndicator()
    })
    return () => cancelAnimationFrame(rafId)
  }, [activeValue, updateIndicator])

  const baseStyles = cn(
    'relative flex',
    orientation === 'horizontal' ? 'w-full' : 'flex-col w-48',
    size === 'sm' && 'text-sm',
    size === 'md' && 'text-sm',
    size === 'lg' && 'text-base'
  )

  const variantStyles = {
    default: cn(
      'border-b border-gray-200 dark:border-gray-700',
      orientation === 'horizontal'
        ? 'overflow-x-auto scrollbar-hide'
        : 'border-r border-b-0'
    ),
    underline: cn(
      'border-b border-gray-200 dark:border-gray-700',
      orientation === 'horizontal'
        ? 'overflow-x-auto scrollbar-hide'
        : 'border-r border-b-0'
    ),
    pills: cn(
      'bg-gray-100 dark:bg-gray-800 rounded-lg p-1',
      orientation === 'horizontal' ? 'gap-1' : 'gap-1 flex-col'
    ),
    cards: cn(
      'gap-2',
      orientation === 'horizontal'
        ? 'overflow-x-auto scrollbar-hide'
        : 'flex-col'
    ),
  }

  return (
    <div
      ref={listRef}
      className={cn(baseStyles, variantStyles[variant], className)}
      role='tablist'
      aria-orientation={orientation}
    >
      {children}

      {/* Animated indicator for default and underline variants */}
      {(variant === 'default' || variant === 'underline') && (
        <div
          className={cn(
            'absolute transition-all duration-300 ease-out',
            variant === 'default' &&
              orientation === 'horizontal' &&
              'bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400',
            variant === 'default' &&
              orientation === 'vertical' &&
              'right-0 w-0.5 bg-blue-600 dark:bg-blue-400',
            variant === 'underline' &&
              orientation === 'horizontal' &&
              'bottom-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400',
            variant === 'underline' &&
              orientation === 'vertical' &&
              'right-0 w-0.5 rounded-full bg-blue-600 dark:bg-blue-400'
          )}
          style={indicatorStyle}
        />
      )}
    </div>
  )
}

// TabsTrigger: clickable tab label
interface TabsTriggerProps {
  value: string
  disabled?: boolean
  className?: string
  children: ReactNode
}

export const TabsTrigger: FC<TabsTriggerProps> = ({
  value,
  disabled = false,
  className,
  children,
}) => {
  const { activeValue, setActiveValue, variant, size, orientation } =
    useTabsContext()
  const isActive = activeValue === value

  const handleClick = () => {
    if (!disabled) {
      setActiveValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveValue(value)
    }
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const baseStyles = cn(
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
    sizeStyles[size],
    disabled && 'opacity-50 cursor-not-allowed',
    !disabled && 'cursor-pointer',
    orientation === 'vertical' && 'w-full justify-start'
  )

  const variantStyles = {
    default: cn(
      'hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap',
      'border-b-2 border-transparent',
      isActive
        ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600',
      orientation === 'vertical' && 'border-b-0 border-r-2'
    ),
    underline: cn(
      'hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap',
      'border-b-2 border-transparent',
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
      orientation === 'vertical' && 'border-b-0 border-r-2'
    ),
    pills: cn(
      'rounded-md whitespace-nowrap',
      isActive
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50'
    ),
    cards: cn(
      'rounded-lg border whitespace-nowrap',
      isActive
        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
    ),
  }

  return (
    <button
      role='tab'
      type='button'
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-state={isActive ? 'active' : 'inactive'}
      data-value={value}
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
    >
      {children}
    </button>
  )
}

// TabsContent: content panel for active tab
interface TabsContentProps {
  value: string
  className?: string
  forceMount?: boolean
  children: ReactNode
}

export const TabsContent: FC<TabsContentProps> = ({
  value,
  className,
  forceMount = false,
  children,
}) => {
  const { activeValue, orientation } = useTabsContext()
  const isActive = activeValue === value
  const [shouldRender, setShouldRender] = useState(isActive)

  useEffect(() => {
    if (isActive) {
      setShouldRender(true)
    } else if (!forceMount) {
      const timer = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isActive, forceMount])

  if (!shouldRender && !forceMount) return null

  return (
    <div
      role='tabpanel'
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn(
        'mt-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-gray-900',
        'transition-all duration-200',
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
        forceMount && !isActive && 'hidden',
        orientation === 'vertical' && 'mt-0 flex-1',
        className
      )}
      style={{
        display: forceMount && !isActive ? 'none' : undefined,
      }}
    >
      {children}
    </div>
  )
}
