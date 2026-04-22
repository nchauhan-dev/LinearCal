"use client"

import { WaitlistAdmin } from "@/components/waitlist-admin"
import { AuthGuardNew } from "@/components/auth-guard-new"

export default function WaitlistAdminPage() {
  return (
    <AuthGuardNew requireAuth={true}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Waitlist Management</h1>
            <p className="text-gray-600">View and manage Linear Calendar waitlist entries</p>
          </div>
          <WaitlistAdmin />
        </div>
      </div>
    </AuthGuardNew>
  )
}
