import { auth } from "./auth"
import { NextResponse } from "next/server"

export async function getApiUser() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }
  
  return session.user
}

export async function requireApiUser() {
  const user = await getApiUser()
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  return user
}

