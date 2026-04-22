"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KeyboardShortcutsHelp } from "./keyboard-shortcuts-help"
import { getMonthName } from "@/lib/date-utils"

interface CalendarHeaderProps {
  currentDate: Date
  onNavigate: (direction: "prev" | "next") => void
  onToday: () => void
  onToggleSidebar?: () => void
  isMobile?: boolean
}

export function CalendarHeader({ currentDate, onNavigate, onToday, onToggleSidebar, isMobile }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 text-gray-900 bg-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl md:text-2xl">
          <span className="font-semibold">{getMonthName(currentDate.getMonth())}</span>{" "}
          <span className="font-thin">{currentDate.getFullYear()}</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {!isMobile && <KeyboardShortcutsHelp />}
        <Button variant="ghost" size="sm" onClick={() => onNavigate("prev")} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onToday} size={isMobile ? "sm" : "default"}>
          Today
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("next")} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
