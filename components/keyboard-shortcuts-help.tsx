"use client"

import { Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function KeyboardShortcutsHelp() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="space-y-2 p-2 text-sm">
          <div className="font-medium">Keyboard Shortcuts</div>
          <div className="space-y-1">
            <div>
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">T</kbd> - Go to today
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl/Cmd + ←</kbd> - Previous month
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl/Cmd + →</kbd> - Next month
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Alt/Opt + Click</kbd> - Quick add event
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl/Cmd + +/-</kbd> - Zoom
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
