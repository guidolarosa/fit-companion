import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Allow access to auth routes, login page, landing page, and static assets
  if (
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/landing") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Check profile completeness for authenticated users
  // Skip for onboarding page and API routes (needed during onboarding)
  const isOnboarding = request.nextUrl.pathname.startsWith("/onboarding")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/")

  if (!isOnboarding && !isApiRoute && !session.user?.profileComplete) {
    // Check for the temporary onboarding_complete cookie as a fallback
    // This handles the race condition where the JWT hasn't been refreshed yet
    const onboardingCookie = request.cookies.get("onboarding_complete")
    if (onboardingCookie?.value === "1") {
      // Clear the temporary cookie and let the user through
      const response = NextResponse.next()
      response.cookies.delete("onboarding_complete")
      return response
    }

    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - login (login page)
     * - landing (landing page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|login|landing|_next/static|_next/image|favicon.ico).*)",
  ],
}
