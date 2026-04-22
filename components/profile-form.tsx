"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ProfileFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  currentEmail: string
  onSubmit: (name: string, email: string) => void
  trigger: React.ReactNode
}

export function ProfileForm({ isOpen, onOpenChange, currentName, currentEmail, onSubmit, trigger }: ProfileFormProps) {
  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail)

  const handleSubmit = () => {
    onSubmit(name.trim(), email.trim())
    onOpenChange(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === "Escape") {
      setName(currentName)
      setEmail(currentEmail)
      onOpenChange(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      setName(currentName)
      setEmail(currentEmail)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start" side="top" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Profile Settings</h4>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="profile-name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Full name..."
                className="input-no-outline mt-1"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="profile-email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter email..."
                className="input-no-outline mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleSubmit}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
