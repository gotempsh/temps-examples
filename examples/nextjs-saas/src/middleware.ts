import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/billing', '/settings']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for session token (better-auth uses this cookie name)
  const sessionToken = request.cookies.get('better-auth.session_token')?.value
  const isAuthenticated = !!sessionToken

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
