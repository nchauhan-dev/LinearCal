"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { LoadingState } from "./loading-state"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)

      if (requireAuth && !user) {
        router.push("/home")
      }
    })

    return () => unsubscribe()
  }, [requireAuth, router])

  if (loading) {
    return <LoadingState />
  }

  if (requireAuth && !user) {
    return <LoadingState />
  }

  return <>{children}</>
}
