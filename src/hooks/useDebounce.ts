import { useEffect, useState } from 'react'

export const useDebounce = (filter: string, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(filter)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(filter)
    }, delay)

    return () => clearTimeout(timeout)
  }, [filter, delay])

  return debouncedValue
}
