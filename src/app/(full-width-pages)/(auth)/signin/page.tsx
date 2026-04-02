import { Metadata } from 'next'

import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'Two X | Sign In Page',
  description: 'This is Two X Signin Page',
}

export default function SignIn() {
  return <SignInForm />
}
