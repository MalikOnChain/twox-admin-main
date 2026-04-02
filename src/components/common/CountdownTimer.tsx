import React, { useEffect, useState } from 'react'

interface CountdownTimerProps {
  endDate: string | Date
  serverTime?: number
  className?: string
  showLabels?: boolean
  onComplete?: () => void
  compact?: boolean
  autoStart?: boolean
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  serverTime,
  className = '',
  showLabels = true,
  onComplete,
  compact = false,
  autoStart = false,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isRunning, setIsRunning] = useState(autoStart)
  const [initialTimeLeft, setInitialTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = serverTime
        ? new Date(serverTime).getTime()
        : new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (onComplete) onComplete()
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })

      // Store the initial time difference if not already set
      if (initialTimeLeft === null) {
        setInitialTimeLeft(difference)
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second if running
    let timer: NodeJS.Timeout | null = null
    if (isRunning) {
      timer = setInterval(calculateTimeLeft, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [endDate, serverTime, onComplete, isRunning, initialTimeLeft])

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    if (initialTimeLeft !== null) {
      const end = new Date(endDate).getTime()
      const now = serverTime
        ? new Date(serverTime).getTime()
        : new Date().getTime()
      const difference = end - now

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'days' },
    { value: timeLeft.hours, label: 'hrs' },
    { value: timeLeft.minutes, label: 'min' },
    { value: timeLeft.seconds, label: 'sec' },
  ]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className='flex items-center gap-1'>
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            {index > 0 && <span className='text-gray-400'>:</span>}
            <div
              className={`flex flex-col items-center ${compact ? 'mx-1' : 'mx-2'}`}
            >
              <div
                className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-800 dark:text-white/90`}
              >
                {unit.value.toString().padStart(2, '0')}
              </div>
              {showLabels && (
                <span
                  className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400`}
                >
                  {unit.label}
                </span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {!compact && (
        <div className='mt-2 flex gap-2'>
          <button
            onClick={handleStartPause}
            className='rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600'
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className='rounded-md bg-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

export default CountdownTimer
