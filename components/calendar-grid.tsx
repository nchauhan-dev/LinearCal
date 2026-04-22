"use client"

import { CalendarDay } from "./calendar-day"
import type { CalendarEvent } from "@/types/calendar"
import { getMonthDays, formatDate, isSameDay } from "@/lib/date-utils"

interface CalendarGridProps {
  currentDate: Date
  selectedDate: Date | null
  events: CalendarEvent[]
  onDateSelect: (date: Date) => void
  onAddEvent: (title: string, date: Date, description?: string) => void
  onDeleteEvent: (eventId: string) => void
  onToggleEvent: (eventId: string, completed: boolean) => void
}

export function CalendarGrid({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onAddEvent,
  onDeleteEvent,
  onToggleEvent,
}: CalendarGridProps) {
  const days = getMonthDays(currentDate.getFullYear(), currentDate.getMonth())
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date)
    return events.filter((event) => event.date === dateStr)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Week day headers extending to edges */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-white">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid extending to edges */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth()
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
          const dayEvents = getEventsForDate(date)
          const row = Math.floor(index / 7)
          const col = index % 7

          return (
            <CalendarDay
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              events={dayEvents}
              onDateSelect={onDateSelect}
              onAddEvent={onAddEvent}
              onDeleteEvent={onDeleteEvent}
              onToggleEvent={onToggleEvent}
              row={row}
              col={col}
            />
          )
        })}
      </div>
    </div>
  )
}
