"use client"

import type React from "react"
import { useState } from "react"
import { Plus, MoreVertical, Pin, Trash2, ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ColorPicker } from "@/components/color-picker"
import { getTaskColorClasses } from "@/lib/colors"
import type { CalendarEvent } from "@/types/calendar"
import { getDayName, getMonthName } from "@/lib/date-utils"

interface DateDetailPanelProps {
  selectedDate: Date | null
  events: CalendarEvent[]
  onAddEvent: (title: string, date: Date) => void
  onDeleteEvent: (eventId: string) => void
  onToggleEvent: (eventId: string, completed: boolean) => void
  onUpdateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void
  onBack?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function DateDetailPanel({
  selectedDate,
  events,
  onAddEvent,
  onDeleteEvent,
  onToggleEvent,
  onUpdateEvent,
  onBack,
  isCollapsed = false,
  onToggleCollapse,
}: DateDetailPanelProps) {
  const [newEventTitle, setNewEventTitle] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingDescription, setEditingDescription] = useState("")
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

  // Sort events: pinned first (regardless of completion status), then by creation date
  const sortedEvents = [...events].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return (b.createdAt || 0) - (a.createdAt || 0)
  })

  if (!selectedDate) {
    if (isCollapsed) {
      return (
        <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4">
          {onToggleCollapse && (
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0 mb-4">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
          )}
          <div className="writing-mode-vertical text-xs text-gray-500 transform rotate-180">Select Date</div>
        </div>
      )
    }

    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6">
          <p className="text-gray-500">Select a date to view details</p>
        </div>
        <div className="border-t p-6">
          {onToggleCollapse && (
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4">
        {onToggleCollapse && (
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0 mb-4">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        )}
        <div className="writing-mode-vertical text-xs text-gray-500 transform rotate-180">
          {getDayName(selectedDate.getDay())}
        </div>
        {events.length > 0 && <div className="mt-4 w-2 h-2 bg-gray-600 rounded-full"></div>}
      </div>
    )
  }

  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      onAddEvent(newEventTitle.trim(), selectedDate)
      setNewEventTitle("")
      setIsAdding(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddEvent()
    } else if (e.key === "Escape") {
      setIsAdding(false)
      setNewEventTitle("")
    }
  }

  const handleEditSubmit = (eventId: string) => {
    const trimmedTitle = editingTitle.trim()
    const trimmedDescription = editingDescription.trim()
    const event = events.find((e) => e.id === eventId)

    if (!event) return

    const updates: Partial<CalendarEvent> = {}

    if (trimmedTitle !== event.title) {
      updates.title = trimmedTitle
    }

    if (trimmedDescription !== (event.description || "")) {
      updates.description = trimmedDescription || undefined
    }

    if (Object.keys(updates).length > 0) {
      onUpdateEvent(eventId, updates)
    }

    setEditingEventId(null)
    setEditingTitle("")
    setEditingDescription("")
  }

  const handleEditCancel = () => {
    setEditingEventId(null)
    setEditingTitle("")
    setEditingDescription("")
  }

  const handleEditKeyPress = (e: React.KeyboardEvent, eventId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleEditSubmit(eventId)
    } else if (e.key === "Escape") {
      handleEditCancel()
    }
  }

  const handleEdit = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingEventId(event.id)
    setEditingTitle(event.title)
    setEditingDescription(event.description || "")
  }

  const handlePinEvent = (eventId: string, pinned: boolean, e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateEvent(eventId, { pinned })
  }

  const handleColorSelect = (eventId: string, color: string) => {
    onUpdateEvent(eventId, { color: color === "none" ? undefined : color })
    setShowColorPicker(null)
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header Section */}
      <div className="p-6 pb-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Calendar</span>
          </Button>
        )}

        <div className="flex items-center justify-between mb-0">
          <h2 className="text-lg font-semibold text-gray-900">{getDayName(selectedDate.getDay())}</h2>
          {onToggleCollapse && (
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-gray-600 font-light">
          {getMonthName(selectedDate.getMonth())} {selectedDate.getDate()}, {selectedDate.getFullYear()}
        </p>
      </div>

      {/* Scrollable Content Section */}
      <ScrollArea className="flex-1">
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">Tasks</h3>
              {events.length > 0 && (
                <span className="text-xs text-gray-500">
                  {events.filter((e) => e.completed).length}/{events.length} completed
                </span>
              )}
            </div>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)} className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {isAdding && (
            <div className="mb-3">
              <Input
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Event title..."
                className="input-no-outline mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddEvent}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false)
                    setNewEventTitle("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {sortedEvents.length === 0 ? (
              <p className="text-gray-500 text-sm font-light">No tasks scheduled</p>
            ) : (
              sortedEvents.map((event) => {
                const colorClasses = getTaskColorClasses(event.color)

                return (
                  <div
                    key={event.id}
                    className={`
                      group flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer
                      ${event.completed ? "opacity-60" : ""}
                      ${event.pinned ? "border-l-[6px] border-l-gray-400" : ""}
                    `}
                    style={{
                      backgroundColor: colorClasses.fillStyle.backgroundColor,
                      borderColor: colorClasses.borderStyle.borderColor,
                    }}
                    onClick={() => editingEventId !== event.id && onToggleEvent(event.id, !event.completed)}
                  >
                    <div className="flex-1 min-w-0">
                      {editingEventId === event.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => handleEditKeyPress(e, event.id)}
                            placeholder="Task title..."
                            className="input-no-outline text-sm font-light"
                            autoFocus
                          />
                          <Input
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            onKeyDown={(e) => handleEditKeyPress(e, event.id)}
                            placeholder="Description (optional)..."
                            className="input-no-outline text-xs h-7 bg-transparent p-0 pl-2"
                          />
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" onClick={() => handleEditSubmit(event.id)} className="h-7 text-xs py-0">
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleEditCancel} className="h-7 text-xs py-0">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-2">
                            <span
                              className={`text-sm ${event.pinned ? "font-medium" : "font-light"} ${event.completed ? "line-through text-gray-400 opacity-70" : "text-gray-900"}`}
                            >
                              {event.title}
                            </span>
                          </div>

                          {event.description && (
                            <p
                              className={`text-xs mt-1 pl-2 ${event.completed ? "line-through text-gray-300 opacity-70" : "text-gray-600"}`}
                            >
                              {event.description}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {editingEventId !== event.id && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleEdit(event, e)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="h-3 w-3 text-gray-600" />
                        </Button>

                        <DropdownMenu
                          open={showColorPicker === event.id}
                          onOpenChange={(open) => setShowColorPicker(open ? event.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => e.stopPropagation()}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-3 w-3 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={(e) => handlePinEvent(event.id, !event.pinned, e)}>
                              <Pin className="h-3.5 w-3.5 mr-2" />
                              {event.pinned ? "Unpin" : "Pin to top"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteEvent(event.id)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ColorPicker
                              onColorSelect={(color) => handleColorSelect(event.id, color)}
                              currentColor={event.color}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
