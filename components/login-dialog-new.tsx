"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginDialogNew({ isOpen, onClose }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [activeTab, setActiveTab] = useState("signin")

  // Add a new state for forgot password mode
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)

  const router = useRouter()

  // Add the resetPassword function from useAuth
  const { signIn, signUp, loading, error, resetPassword, clearError } = useAuth()

  // Add a new function to handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await resetPassword(resetEmail)
    if (result.success) {
      setResetSuccess(true)
    }
  }

  // Add a function to toggle forgot password mode
  const toggleForgotPasswordMode = () => {
    setForgotPasswordMode(!forgotPasswordMode)
    setResetSuccess(false)
    clearError()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await signIn(email, password)
    if (result.success) {
      onClose()
      router.push("/dashboard")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signupPassword.length < 6) {
      return
    }

    const result = await signUp(signupEmail, signupPassword, signupName)
    if (result.success) {
      onClose()
      router.push("/dashboard")
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    clearError()
  }

  const handleInputChange = () => {
    if (error) clearError()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center">Linear Calendar</h1>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-6">
              {!forgotPasswordMode ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        handleInputChange()
                      }}
                      placeholder="your.email@example.com"
                      required
                      className="w-full input-no-outline"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={toggleForgotPasswordMode}
                        className="text-xs text-gray-500 hover:text-gray-800"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        handleInputChange()
                      }}
                      placeholder="••••••••"
                      required
                      className="w-full input-no-outline"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
                  )}

                  <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  {!resetSuccess ? (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="reset-email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => {
                            setResetEmail(e.target.value)
                            handleInputChange()
                          }}
                          placeholder="your.email@example.com"
                          required
                          className="w-full input-no-outline"
                        />
                        <p className="text-xs text-gray-500">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                      </div>

                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                          {error}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={toggleForgotPasswordMode} className="flex-1">
                          Back to Login
                        </Button>
                        <Button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800" disabled={loading}>
                          {loading ? "Sending..." : "Reset Password"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                        Password reset email sent! Check your inbox for further instructions.
                      </div>
                      <Button type="button" onClick={toggleForgotPasswordMode} className="w-full">
                        Back to Login
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-center text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="signup-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value)
                      handleInputChange()
                    }}
                    placeholder="Your full name"
                    className="w-full input-no-outline"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value)
                      handleInputChange()
                    }}
                    placeholder="your.email@example.com"
                    required
                    className="w-full input-no-outline"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value)
                      handleInputChange()
                    }}
                    placeholder="••••••••"
                    required
                    className="w-full input-no-outline"
                  />
                  <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  disabled={loading || signupPassword.length < 6}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
