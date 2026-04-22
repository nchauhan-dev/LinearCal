"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { debugFirestore } from "@/lib/firestore-debug"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function DebugButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleDebug = async () => {
    setLoading(true)
    try {
      const debugResult = await debugFirestore()
      setResult(debugResult)
    } catch (error) {
      setResult({ success: false, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleDebug} disabled={loading} variant="outline" size="sm">
        {loading ? "Testing..." : "Test Firestore Connection"}
      </Button>

      {result && (
        <div
          className={`text-sm p-2 rounded ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          <div className="flex items-center gap-1">
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{result.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
