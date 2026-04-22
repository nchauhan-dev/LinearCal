"use client"

import type React from "react"
import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight, Calendar, Menu, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MonthlyTaskComponent } from "./monthly-task"
import { useMonthlyTasksNew } from "@/hooks/use-monthly-tasks-new"
import { getMonthName } from "@/lib/date-utils"
import { SettingsDialog } from "./settings-dialog"

interface MonthlyTasksSidebarNewProps {
  currentDate: Date
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function MonthlyTasksSidebarNew({ currentDate, isCollapsed, onToggleCollapse }: MonthlyTasksSidebarNewProps) {
  const { tasks, completedTasks, pendingTasks, loading, addTask, toggleTask, updateTask, deleteTask } =
    useMonthlyTasksNew(currentDate)
  const [isAdding, setIsAdding] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const monthName = `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`

  // Sort tasks: pinned first, then by creation date
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return (b.createdAt || 0) - (a.createdAt || 0)
  })

  const sortedCompletedTasks = [...completedTasks].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return (b.createdAt || 0) - (a.createdAt || 0)
  })

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const result = await addTask(newTaskTitle.trim())
      if (result.success) {
        setNewTaskTitle("")
        setIsAdding(false)
      } else {
        console.error("Failed to add task:", result.error)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    } else if (e.key === "Escape") {
      setIsAdding(false)
      setNewTaskTitle("")
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    const result = await toggleTask(taskId, completed)
    if (!result.success) {
      console.error("Failed to toggle task:", result.error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: any) => {
    const result = await updateTask(taskId, updates)
    if (!result.success) {
      console.error("Failed to update task:", result.error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    const result = await deleteTask(taskId)
    if (!result.success) {
      console.error("Failed to delete task:", result.error)
    }
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 flex flex-col items-center py-4">
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0 mb-4">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="writing-mode-vertical text-xs text-gray-500 transform rotate-180">Monthly Tasks</div>
          {pendingTasks.length > 0 && (
            <Badge variant="secondary" className="mt-4 text-xs">
              {pendingTasks.length}
            </Badge>
          )}
        </div>

        <div className="p-2 space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              <SettingsDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)} className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly <span className="font-light">Tasks</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-gray-600 font-light">{monthName}</p>
        </div>
      </div>

      {/* Tasks List */}
      <ScrollArea className="flex-1">
        <div className="px-6 pb-6">
          {/* Inline Add Task Form */}
          {isAdding && (
            <div className="mb-4">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Task title..."
                className="input-no-outline mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddTask}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false)
                    setNewTaskTitle("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 && !isAdding ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 font-light mb-4">No tasks for this month</p>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
                Add your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Tasks */}
              {sortedPendingTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Pending{" "}
                    {sortedPendingTasks.length > 0 && (
                      <span className="text-gray-500">({sortedPendingTasks.length})</span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    {sortedPendingTasks.map((task) => (
                      <MonthlyTaskComponent
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onUpdate={handleUpdateTask}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {sortedCompletedTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Completed{" "}
                    {sortedCompletedTasks.length > 0 && (
                      <span className="text-gray-500">({sortedCompletedTasks.length})</span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    {sortedCompletedTasks.map((task) => (
                      <MonthlyTaskComponent
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onUpdate={handleUpdateTask}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Linear Calendar</p>
              <p className="text-xs text-gray-500">Desktop App</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-48">
              <SettingsDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
