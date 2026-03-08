"use server"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function loginAction(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid_credentials" }
    }
    return { error: "unknown" }
  }

  redirect("/dashboard")
}

export async function registerAction(
  email: string,
  password: string,
  name: string
) {
  if (!email || !password) {
    return { error: "missing_fields" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "user_exists" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  })

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "auth_failed" }
    }
    return { error: "unknown" }
  }

  redirect("/onboarding")
}
