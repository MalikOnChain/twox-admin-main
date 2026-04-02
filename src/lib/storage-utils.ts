type StorageType = 'localStorage' | 'sessionStorage' | 'cookie'

interface StorageProps {
  key: string
  initialValue?: unknown
  type?: StorageType
  expires?: number // Cookie expiration in days
}

interface StorageHandlerReturn {
  value: unknown
  getValue: () => unknown
  setValue: (value: unknown) => void
  removeValue: () => void
  clear: () => void
}

const storageHandler = ({
  key,
  initialValue = null,
  type = 'localStorage',
  expires = 7,
}: StorageProps): StorageHandlerReturn => {
  // Retrieve the initial value
  const getStoredValue = (key: string): unknown => {
    if (typeof window === 'undefined') return

    try {
      if (type === 'cookie') {
        const cookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${key}=`))
        return cookie ? JSON.parse(cookie.split('=')[1]) : initialValue
      }

      const item = window[type]?.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading storage:', error)
      return initialValue
    }
  }

  let value = getStoredValue(key)

  // Set a value
  const setValue = (newValue: unknown) => {
    if (typeof window === 'undefined') return

    try {
      const valueToStore =
        newValue instanceof Function ? newValue(value) : newValue
      value = valueToStore

      if (type === 'cookie') {
        const date = new Date()
        date.setDate(date.getDate() + expires)
        document.cookie = `${key}=${JSON.stringify(valueToStore)}; expires=${date.toUTCString()}; path=/`
      } else {
        window[type]?.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error setting storage:', error)
    }
  }

  // Remove a value
  const removeValue = () => {
    if (typeof window === 'undefined') return

    try {
      if (type === 'cookie') {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
      } else {
        window[type]?.removeItem(key)
      }
      value = null
    } catch (error) {
      console.error('Error removing from storage:', error)
    }
  }

  // Clear all storage values
  const clear = () => {
    if (typeof window === 'undefined') return

    try {
      if (type === 'cookie') {
        document.cookie.split(';').forEach((cookie) => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
        })
      } else {
        window[type]?.clear()
      }
      value = null
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  return {
    value,
    setValue,
    removeValue,
    clear,
    getValue: () => getStoredValue(key),
  }
}

export default storageHandler
