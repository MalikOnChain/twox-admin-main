import React, { ReactNode, useEffect, useRef, useState } from 'react'

interface ToolTipProps {
  children: ReactNode
  text: string
}

const ToolTip = ({ children, text }: ToolTipProps) => {
  const [position, setPosition] = useState<'left' | 'right' | 'center'>(
    'center'
  )
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePosition = () => {
      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth

        if (tooltipRect.left < 0) {
          setPosition('left')
        } else if (tooltipRect.right > viewportWidth) {
          setPosition('right')
        } else {
          setPosition('center')
        }
      }
    }

    handlePosition()
    window.addEventListener('resize', handlePosition)

    return () => {
      window.removeEventListener('resize', handlePosition)
    }
  }, [])

  return (
    <div className='group relative inline-block'>
      {children}
      <div
        ref={tooltipRef}
        className={`invisible absolute bottom-full z-30 mb-2.5 opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 ${
          position === 'left'
            ? 'left-0 translate-x-0'
            : position === 'right'
              ? 'right-0 translate-x-0'
              : 'left-1/2 -translate-x-1/2'
        }`}
      >
        <div className='relative'>
          <div className='drop-shadow-4xl rounded-lg bg-white px-3 py-2 text-xs font-medium whitespace-nowrap text-gray-700 dark:bg-[#1E2634] dark:text-white'>
            {text}
          </div>
          <div
            className={`absolute -bottom-1 h-3 w-4 rotate-45 bg-white text-gray-700 dark:bg-[#1E2634] dark:text-white ${
              position === 'left'
                ? 'left-4'
                : position === 'right'
                  ? 'right-4'
                  : 'left-1/2 -translate-x-1/2'
            }`}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ToolTip
