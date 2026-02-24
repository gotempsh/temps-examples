import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account to access your dashboard.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthForm mode="login" />
    </div>
  )
}
