"use client"

import type React from "react"

import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight, Calendar, User, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MonthlyTaskComponent } from "./monthly-task"
import { ProfileForm } from "./profile-form"
import { useMonthlyTasks } from "@/hooks/use-monthly-tasks"
import { getMonthName } from "@/lib/date-utils"
import { signOut, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface MonthlyTasksSidebarProps {
  currentDate: Date
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function MonthlyTasksSidebar({ currentDate, isCollapsed, onToggleCollapse }: MonthlyTasksSidebarProps) {
  const { tasks, completedTasks, pendingTasks, loading, user, addTask, toggleTask, updateTask, deleteTask } =
    useMonthlyTasks(currentDate)
  const [isAdding, setIsAdding] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  const monthName = `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim())
      setNewTaskTitle("")
      setIsAdding(false)
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

  const handleProfileSubmit = async (name: string, email: string) => {
    if (!user) return

    try {
      // Update the user's display name in Firebase Auth
      await updateProfile(user, {
        displayName: name || user.email?.split("@")[0] || "User",
      })

      console.log("Profile updated successfully:", { name, email })

      // Force a re-render by updating the user state
      // The auth state listener will pick up the change
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await signOut(auth)
        router.push("/home")
      } catch (error) {
        console.error("Logout error:", error)
      }
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

        {/* Collapsed Toolbar */}
        <div className="p-2 space-y-2">
          <ProfileForm
            isOpen={isProfileOpen}
            onOpenChange={setIsProfileOpen}
            currentName={user?.displayName || user?.email?.split("@")[0] || "User"}
            currentEmail={user?.email || ""}
            onSubmit={handleProfileSubmit}
            trigger={
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <User className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Simplified Header */}
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

          {tasks.length === 0 && !isAdding ? (
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
              {pendingTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Pending {pendingTasks.length > 0 && <span className="text-gray-500">({pendingTasks.length})</span>}
                  </h4>
                  <div className="space-y-2">
                    {pendingTasks.map((task) => (
                      <MonthlyTaskComponent
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Completed{" "}
                    {completedTasks.length > 0 && <span className="text-gray-500">({completedTasks.length})</span>}
                  </h4>
                  <div className="space-y-2">
                    {completedTasks.map((task) => (
                      <MonthlyTaskComponent
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer with User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <ProfileForm
            isOpen={isProfileOpen}
            onOpenChange={setIsProfileOpen}
            currentName={user?.displayName || user?.email?.split("@")[0] || "User"}
            currentEmail={user?.email || ""}
            onSubmit={handleProfileSubmit}
            trigger={
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md -m-2">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                </div>
              </div>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
