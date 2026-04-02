/**
 * Validates an email address.
 * @param value - The email address to validate.
 * @returns A string with an error message if invalid, or undefined if valid.
 */
export const validateEmail = (value: string): string | undefined => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!regex.test(value)) {
    return 'Invalid email format'
  }
  return undefined
}

export const validatePassword = (password: string): string | undefined => {
  const rule = {
    minLength: 6,
    exp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z0-9@$!%*?&]+$/,
  }

  if (password.length < rule.minLength) {
    return `Password must be at least ${rule.minLength} characters long.`
  }

  if (password.length > 64) {
    return 'Password must be less than 64 characters long.'
  }
  //  disable for now
  // if (!rule.exp.test(password)) {
  //     return `Password does not meet the security requirements.`;
  // }

  return undefined // Explicitly return undefined when the password is valid
}
