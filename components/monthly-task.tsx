"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"
import { useState } from "react"
import { MoreVertical, Pin, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ColorPicker } from "@/components/color-picker"
import { getTaskColorClasses } from "@/lib/colors"
import type { MonthlyTask } from "@/types/calendar"

interface MonthlyTaskProps {
  task: MonthlyTask
  onToggle: (taskId: string, completed: boolean) => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, updates: Partial<MonthlyTask>) => void
  onPin?: (taskId: string, pinned: boolean) => void
}

export function MonthlyTaskComponent({ task, onToggle, onDelete, onUpdate, onPin }: MonthlyTaskProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [titleValue, setTitleValue] = useState(task.title)
  const [descriptionValue, setDescriptionValue] = useState(task.description || "")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colorClasses = getTaskColorClasses(task.color)

  const handleEditSubmit = () => {
    const trimmedTitle = titleValue.trim()
    const trimmedDescription = descriptionValue.trim()

    const updates: Partial<MonthlyTask> = {}

    // Only update if there's actually a change
    if (trimmedTitle !== task.title) {
      updates.title = trimmedTitle
    }

    if (trimmedDescription !== (task.description || "")) {
      updates.description = trimmedDescription || undefined
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(task.id, updates)
    }

    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setTitleValue(task.title)
    setDescriptionValue(task.description || "")
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleEditSubmit()
    } else if (e.key === "Escape") {
      handleEditCancel()
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPin) {
      onPin(task.id, !task.pinned)
    } else {
      onUpdate(task.id, { pinned: !task.pinned })
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(task.id)
  }

  const handleColorSelect = (color: string) => {
    onUpdate(task.id, { color: color === "none" ? undefined : color })
    setShowColorPicker(false)
  }

  return (
    <div
      className={`
        group flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer
        ${task.completed ? "opacity-60" : ""}
        ${task.pinned ? "border-l-[6px] border-l-gray-400" : ""}
      `}
      style={{
        backgroundColor: colorClasses.fillStyle.backgroundColor,
        borderColor: colorClasses.borderStyle.borderColor,
      }}
      onClick={() => !isEditing && onToggle(task.id, !task.completed)}
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Task title..."
              className="input-no-outline text-sm font-light"
              autoFocus
            />
            <Input
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Description (optional)..."
              className="input-no-outline text-xs h-7 bg-transparent p-0 pl-2"
            />
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleEditSubmit} className="h-7 text-xs py-0">
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
                className={`text-sm ${task.pinned ? "font-medium" : "font-light"} ${task.completed ? "line-through text-gray-400 opacity-70" : "text-gray-900"}`}
              >
                {task.title}
              </span>
            </div>

            {task.description && (
              <p
                className={`text-xs mt-1 pl-2 ${task.completed ? "line-through text-gray-300 opacity-70" : "text-gray-600"}`}
              >
                {task.description}
              </p>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-3 w-3 text-gray-600" />
          </Button>

          <DropdownMenu open={showColorPicker} onOpenChange={setShowColorPicker}>
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
              <DropdownMenuItem onClick={handlePin}>
                <Pin className="h-3.5 w-3.5 mr-2" />
                {task.pinned ? "Unpin" : "Pin to top"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ColorPicker onColorSelect={handleColorSelect} currentColor={task.color} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
