import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthForm mode="login" />
    </div>
  )
}
