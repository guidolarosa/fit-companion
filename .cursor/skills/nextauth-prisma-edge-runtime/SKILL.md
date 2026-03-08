---
name: nextauth-prisma-edge-runtime
description: Diagnose and fix NextAuth.js + Prisma authentication issues in Next.js, especially Edge Runtime incompatibilities in middleware. Use when working with authentication, login, registration, session handling, JWT callbacks, middleware redirects, or when seeing JWTSessionError / "PrismaClient is not configured to run in Edge Runtime".
---

# NextAuth.js + Prisma in Next.js (Edge Runtime Pitfalls)

## The Core Problem

Next.js middleware runs in **Edge Runtime**. Prisma ORM **cannot run in Edge Runtime**. If NextAuth callbacks (especially `jwt`) query Prisma, every `auth()` call from middleware will fail silently — sessions appear `null`, and users get redirect-looped back to login.

This is the #1 cause of "login works but user stays on login page" bugs in this stack.

## Diagnosis Checklist

When login/registration "works" (user is created, no client error) but the user never leaves the login page:

1. Check terminal logs for `JWTSessionError` + `PrismaClient is not configured to run in Edge Runtime`
2. Look at the `jwt` callback in `lib/auth.ts` — any `prisma.*` call there will crash in middleware
3. Check the network tab: you'll see a successful POST followed by a redirect back to `/login`

## Rules for Auth Callbacks

### JWT callback — Edge-safe only

The `jwt` callback runs in **both** Node.js (during `signIn`) and Edge Runtime (during middleware `auth()` calls). It must not use Prisma, direct DB access, or any Node.js-only API.

```typescript
callbacks: {
  async jwt({ token, user, trigger, session }) {
    // Set initial values from the user object (only on sign-in, runs in Node.js)
    if (user) {
      token.id = user.id as string
      token.email = user.email as string
      token.profileComplete = user.profileComplete ?? false
    }
    // Accept updates from client-side session updates (e.g. after onboarding)
    // Do NOT query the database here — this runs in Edge Runtime via middleware
    if (trigger === "update" && session?.profileComplete !== undefined) {
      token.profileComplete = session.profileComplete as boolean
    }
    return token
  },
}
```

### Authorize function — Node.js only (safe)

The `authorize` function inside `CredentialsProvider` only runs during `signIn()`, which executes in Node.js (Server Actions / API routes). Prisma is safe here.

### Session callback — Edge-safe required

Same constraint as `jwt` — runs in both runtimes. Only read from `token`, never query the DB.

## Updating Token Data Without DB Queries

When you need to update JWT token data after the initial sign-in (e.g., marking a profile as complete after onboarding):

1. **Client side** — pass data to `updateSession()`:
   ```typescript
   const { update: updateSession } = useSession()
   await updateSession({ profileComplete: true })
   ```

2. **JWT callback** — read from the `session` parameter when `trigger === "update"`:
   ```typescript
   if (trigger === "update" && session?.profileComplete !== undefined) {
     token.profileComplete = session.profileComplete as boolean
   }
   ```

This avoids any DB call in the JWT callback while still allowing token updates.

## Server Actions for Login/Registration

Use Server Actions (not client-side `signIn` from `next-auth/react`) for login and registration. This ensures session cookies are set server-side before any redirect.

```typescript
"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function loginAction(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirect: false })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid_credentials" }
    }
    return { error: "unknown" }
  }
  redirect("/dashboard")
}
```

Key points:
- `redirect: false` prevents NextAuth from handling the redirect internally
- `redirect()` is called **outside** the `try/catch` — only reached on success
- `redirect()` from `next/navigation` throws a `NEXT_REDIRECT` error that Next.js handles

## Client-Side: Handling NEXT_REDIRECT

When calling server actions that use `redirect()`, the thrown `NEXT_REDIRECT` error can bubble up to client `catch` blocks. Guard against it:

```typescript
try {
  const result = await loginAction(email, password)
  if (result?.error) { /* show error */ }
} catch (err: unknown) {
  const digest = (err as { digest?: string })?.digest
  if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
    return // let Next.js handle the redirect
  }
  setError("Something went wrong")
}
```

## Quick Reference: What Runs Where

| Code location | Runtime | Prisma safe? |
|---|---|---|
| `authorize()` in CredentialsProvider | Node.js | Yes |
| `jwt()` callback | Node.js + Edge | **No** |
| `session()` callback | Node.js + Edge | **No** |
| Server Actions (`"use server"`) | Node.js | Yes |
| API Route Handlers | Node.js | Yes |
| `middleware.ts` | Edge | **No** |

## Common Symptoms → Likely Cause

| Symptom | Cause |
|---|---|
| Login succeeds but user stays on login page | `jwt` callback uses Prisma → crashes in middleware → session is `null` → redirect to `/login` |
| `JWTSessionError` in terminal logs | Prisma (or other Node.js API) used in `jwt`/`session` callback |
| "Ocurrió un error" after registration | `NEXT_REDIRECT` caught by client `catch` block |
| 303 redirect loop in network tab | Middleware can't read session → keeps redirecting to login |
| Registration works but auto-login fails | Using client-side `signIn` instead of server-side; cookies not set before redirect |
