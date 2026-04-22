"use client"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CalendarEvent } from "@/types/calendar"
import { getTaskColorClasses } from "@/lib/colors"

interface CalendarEventProps {
  event: CalendarEvent
  onDelete: (eventId: string) => void
  onToggle: (eventId: string, completed: boolean) => void
}

export function CalendarEventComponent({ event, onDelete, onToggle }: CalendarEventProps) {
  const [isHovered, setIsHovered] = useState(false)
  const colorClasses = getTaskColorClasses(event.color)

  // Determine if we should use the color system or the original styling
  const hasCustomColor = event.color && event.color !== "none"

  // Style based on whether there's a custom color or not
  const backgroundStyle = hasCustomColor
    ? { backgroundColor: colorClasses.fillStyle.backgroundColor }
    : { backgroundColor: event.completed ? "rgb(249, 250, 251)" : "rgb(243, 244, 246)" } // Original light grey

  const borderStyle = hasCustomColor
    ? { borderColor: colorClasses.borderStyle.borderColor }
    : { borderColor: "rgb(229, 231, 235)" } // Original border color

  return (
    <div
      className={`
        group flex items-center justify-between px-2 py-1 rounded-md text-xs transition-all duration-200 border
        ${event.completed ? "opacity-60" : ""}
        ${event.pinned ? "border-l-2 border-l-gray-400 pl-1" : ""}
        ${!hasCustomColor && !event.completed ? "hover:bg-gray-150" : ""}
      `}
      style={{
        ...backgroundStyle,
        ...borderStyle,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onToggle(event.id, !event.completed)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className={`truncate ${event.completed ? "line-through text-gray-400" : "text-gray-900"}`}
        title={event.title}
      >
        {event.title}
      </span>
      {isHovered && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(event.id)
          }}
          className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
