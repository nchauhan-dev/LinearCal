"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { CalendarEvent } from "@/types/calendar"
import { CalendarEventComponent } from "./calendar-event"
import { isToday } from "@/lib/date-utils"

interface CalendarDayProps {
  date: Date
  isCurrentMonth: boolean
  isSelected: boolean
  events: CalendarEvent[]
  onDateSelect: (date: Date) => void
  onAddEvent: (title: string, date: Date, description?: string) => void
  onDeleteEvent: (eventId: string) => void
  onToggleEvent: (eventId: string, completed: boolean) => void
  row: number
  col: number
}

export function CalendarDay({
  date,
  isCurrentMonth,
  isSelected,
  events,
  onDateSelect,
  onAddEvent,
  onDeleteEvent,
  onToggleEvent,
  row,
  col,
}: CalendarDayProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDescription, setNewEventDescription] = useState("")
  const today = isToday(date)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  const handleClick = () => {
    onDateSelect(date)
  }

  const handleAltClick = (e: React.MouseEvent) => {
    if (e.altKey) {
      e.preventDefault()
      setIsPopoverOpen(true)
    }
  }

  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      // Call the parent's onAddEvent with title, date, and description
      onAddEvent(newEventTitle.trim(), date, newEventDescription.trim() || undefined)

      // Reset form and close popover
      setNewEventTitle("")
      setNewEventDescription("")
      setIsPopoverOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddEvent()
    } else if (e.key === "Escape") {
      setNewEventTitle("")
      setNewEventDescription("")
      setIsPopoverOpen(false)
    }
  }

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open)
    if (!open) {
      setNewEventTitle("")
      setNewEventDescription("")
    }
  }

  return (
    <div
      className={`
  relative p-2 cursor-pointer transition-all duration-200
  ${isWeekend ? "bg-gray-50" : "bg-white"}
  ${today ? "bg-gray-100" : ""}
  ${isSelected ? "ring-2 ring-gray-400 shadow-lg scale-[1.02] z-10" : ""}
  hover:shadow-md hover:scale-[1.01]
  ${row < 5 ? "border-b border-gray-100" : ""}
  ${col < 6 ? "border-r border-gray-100" : ""}
`}
      style={{ minHeight: "calc((100vh - 160px) / 6)" }}
      onClick={handleClick}
      onMouseDown={handleAltClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm font-light ${today ? "text-gray-900 font-normal" : ""} ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}`}
        >
          {date.getDate()}
        </span>
        {isHovered && isCurrentMonth && (
          <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPopoverOpen(true)
                }}
                className="w-5 h-5 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start" side="bottom" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Add Event</h4>
                  <p className="text-sm text-gray-600 mb-3">{date.toLocaleDateString()}</p>
                </div>

                <div className="space-y-3">
                  <Input
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Event title..."
                    className="input-no-outline"
                    autoFocus
                  />

                  <Textarea
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Description (optional)..."
                    className="textarea-no-outline"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleAddEvent} disabled={!newEventTitle.trim()}>
                    Add Event
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsPopoverOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div
        className="space-y-1 overflow-y-auto scrollbar-invisible"
        style={{ maxHeight: "calc((100vh - 160px) / 6 - 2rem)" }}
      >
        {events.map((event) => (
          <CalendarEventComponent key={event.id} event={event} onDelete={onDeleteEvent} onToggle={onToggleEvent} />
        ))}
      </div>
    </div>
  )
}
