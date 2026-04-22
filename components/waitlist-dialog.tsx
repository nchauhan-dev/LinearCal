"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"
import { WaitlistService } from "@/lib/waitlist-service"

interface WaitlistDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistDialog({ isOpen, onClose }: WaitlistDialogProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Use Firebase instead of localStorage
      const result = await WaitlistService.addToWaitlist(email.trim(), "homepage")

      if (result.success) {
        setIsSubmitted(true)
        // Keep localStorage as backup for demo purposes
        localStorage.setItem("waitlist_email", email)
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Waitlist submission error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setIsSubmitted(false)
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <div className="space-y-6">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the Waitlist</h1>
                <p className="text-gray-600">
                  Be the first to know when Linear Calendar launches. We'll send you early access and updates.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="waitlist-email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    placeholder="your.email@example.com"
                    required
                    className="w-full input-no-outline"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
                )}

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>

              <p className="text-xs text-center text-gray-500">
                We respect your privacy. No spam, just updates about Linear Calendar.
              </p>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h2>
                  <p className="text-gray-600 mb-4">
                    Thanks for joining our waitlist. We'll email you at <strong>{email}</strong> when Linear Calendar is
                    ready.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>What's next?</strong>
                    <br />
                    We're putting the finishing touches on Linear Calendar. Expect early access in the coming weeks!
                  </p>
                </div>

                <Button onClick={handleClose} className="w-full bg-gray-900 hover:bg-gray-800">
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
