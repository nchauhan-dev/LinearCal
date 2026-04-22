"use client"

import { FirestoreConnectionTest } from "@/components/firestore-connection-test"
import { AuthGuardNew } from "@/components/auth-guard-new"

export default function DebugPage() {
  return (
    <AuthGuardNew requireAuth={true}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Firestore Debug Dashboard</h1>
          <FirestoreConnectionTest />
        </div>
      </div>
    </AuthGuardNew>
  )
}
