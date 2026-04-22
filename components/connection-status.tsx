"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-200 text-red-800 px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg z-50">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm">Offline - Changes will sync when reconnected</span>
    </div>
  )
}
