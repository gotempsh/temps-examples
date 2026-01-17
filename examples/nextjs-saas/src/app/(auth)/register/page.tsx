import { AuthForm } from '@/components/auth-form'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthForm mode="register" />
    </div>
  )
}
