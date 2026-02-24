import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your account and start building your SaaS today.',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthForm mode="register" />
    </div>
  )
}
