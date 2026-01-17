'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { signIn, signUp } from '@/lib/auth-client'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      if (mode === 'register') {
        const { error } = await signUp.email({
          email,
          password,
          name,
        })
        if (error) {
          setError(error.message || 'Registration failed')
          return
        }
      } else {
        const { error } = await signIn.email({
          email,
          password,
        })
        if (error) {
          setError(error.message || 'Login failed')
          return
        }
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleOAuthSignIn(provider: 'github' | 'google') {
    setLoading(true)
    try {
      await signIn.social({
        provider,
        callbackURL: '/dashboard',
      })
    } catch {
      setError('OAuth sign in failed')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Sign In' : 'Create Account'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Fill in the form to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'Loading...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
          >
            GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
          >
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-primary hover:underline">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}
