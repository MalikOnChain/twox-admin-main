const STORAGE_KEY = 'twox_admin_panel_remembered_login'

export type RememberedAdminLogin = {
  email: string
  password: string
}

/** Plain localStorage; only use on trusted devices. */
export function getRememberedAdminLogin(): RememberedAdminLogin | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as RememberedAdminLogin).email !== 'string' ||
      typeof (parsed as RememberedAdminLogin).password !== 'string'
    ) {
      return null
    }
    return {
      email: (parsed as RememberedAdminLogin).email,
      password: (parsed as RememberedAdminLogin).password,
    }
  } catch {
    return null
  }
}

export function saveRememberedAdminLogin(email: string, password: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }))
  } catch {
    // ignore quota / private mode
  }
}

export function clearRememberedAdminLogin(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
