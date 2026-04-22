"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Settings, FolderOpen, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ElectronStorage, isElectron } from "@/lib/electron-storage"

interface SettingsDialogProps {
  trigger?: React.ReactNode
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [dataFilePath, setDataFilePath] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && isElectron()) {
      loadCurrentPath()
    }
  }, [open])

  const loadCurrentPath = async () => {
    const path = await ElectronStorage.getDataFilePath()
    setDataFilePath(path)
  }

  const handleSelectPath = async () => {
    setLoading(true)
    const result = await ElectronStorage.selectSaveLocation()
    if (result.success && result.path) {
      setDataFilePath(result.path)
      // Reload the page to fetch data from new location
      window.location.reload()
    }
    setLoading(false)
  }

  if (!isElectron()) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure where your calendar data is stored on your computer</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data File Location</label>
            {dataFilePath ? (
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-gray-700 break-all">{dataFilePath}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  No data file location configured. Please select a location to save your calendar data.
                </p>
              </div>
            )}
          </div>

          <Button onClick={handleSelectPath} disabled={loading} className="w-full">
            <FolderOpen className="h-4 w-4 mr-2" />
            {loading ? "Selecting..." : dataFilePath ? "Change Location" : "Select Location"}
          </Button>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Your calendar data will be saved as a JSON file at the location you choose. This file can be backed up,
              synced, or shared across devices.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
