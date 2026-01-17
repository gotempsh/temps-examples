import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Header } from '@/components/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  )
}
