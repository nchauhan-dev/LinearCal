"use client"

import { useState } from "react"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarGrid } from "@/components/calendar-grid"
import { DateDetailPanel } from "@/components/date-detail-panel"
import { DemoMonthlyTasksSidebar } from "@/components/demo-monthly-tasks-sidebar"
import type { CalendarEvent, MonthlyTask } from "@/types/calendar"
import { formatDate } from "@/lib/date-utils"

export default function DemoCalendar() {
  const [currentDate, setCurrentDate] = useState(() => new Date(2025, 4, 1)) // May 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date(2025, 4, 14)) // May 14, 2025
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true) // Start collapsed
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true) // Start collapsed

  // Demo events matching the screenshot
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Sarah's bday",
      date: "2025-05-03",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "2",
      title: "Study group for Chemistry Final",
      date: "2025-05-10",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "3",
      title: "See Prof Smith",
      date: "2025-05-14",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "4",
      title: "History Essay due tonight!",
      date: "2025-05-15",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "5",
      title: "Grocery Shopping",
      date: "2025-05-18",
      completed: true,
      createdAt: Date.now(),
    },
    {
      id: "6",
      title: "Physics final!",
      date: "2025-05-22",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "7",
      title: "Completed task",
      date: "2025-05-19",
      completed: true,
      createdAt: Date.now(),
    },
    {
      id: "8",
      title: "Another completed task",
      date: "2025-05-23",
      completed: true,
      createdAt: Date.now(),
    },
  ])

  // Demo monthly tasks with the specified tasks
  const [monthlyTasks, setMonthlyTasks] = useState<MonthlyTask[]>([
    {
      id: "m1",
      title: "Look for summer internship",
      month: "2025-05",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "m2",
      title: "Order parts for project car 🔧",
      month: "2025-05",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "m3",
      title: "Volunteer at local organization",
      month: "2025-05",
      completed: true,
      createdAt: Date.now(),
    },
    {
      id: "m4",
      title: "Plan a hike with friend group! 🌳",
      month: "2025-05",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "m5",
      title: "Work on budgeting",
      month: "2025-05",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: "m6",
      title: "Work on side project 🤓",
      month: "2025-05",
      completed: false,
      createdAt: Date.now(),
    },
  ])

  const addEvent = (title: string, date: Date, description?: string) => {
    const newEvent: CalendarEvent = {
      id: `demo_${Date.now()}`,
      title,
      date: formatDate(date),
      completed: false,
      createdAt: Date.now(),
      ...(description && { description }),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  const toggleEvent = (eventId: string, completed: boolean) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, completed } : e)))
  }

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)))
  }

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date)
    return events.filter((event) => event.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date(2025, 4, 15) // Demo "today" is May 15, 2025
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className="h-[600px] bg-gray-50 flex">
      {/* Left Sidebar - Monthly Tasks */}
      <DemoMonthlyTasksSidebar
        currentDate={currentDate}
        isCollapsed={leftSidebarCollapsed}
        onToggleCollapse={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        tasks={monthlyTasks}
        onAddTask={(title, description) => {
          const newTask: MonthlyTask = {
            id: `demo_task_${Date.now()}`,
            title,
            month: "2025-05",
            completed: false,
            createdAt: Date.now(),
            ...(description && { description }),
          }
          setMonthlyTasks((prev) => [...prev, newTask])
        }}
        onToggleTask={(taskId, completed) => {
          setMonthlyTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed } : t)))
        }}
        onUpdateTask={(taskId, updates) => {
          setMonthlyTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))
        }}
        onDeleteTask={(taskId) => {
          setMonthlyTasks((prev) => prev.filter((t) => t.id !== taskId))
        }}
      />

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Header with padding */}
        <div className="px-6 pt-6 pb-2 bg-white">
          <CalendarHeader currentDate={currentDate} onNavigate={navigateMonth} onToday={goToToday} />
        </div>

        {/* Calendar grid */}
        <div className="flex-1">
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            onDateSelect={handleDateSelect}
            onAddEvent={addEvent}
            onDeleteEvent={deleteEvent}
            onToggleEvent={toggleEvent}
          />
        </div>
      </div>

      {/* Right Sidebar - Date Details */}
      <DateDetailPanel
        selectedDate={selectedDate}
        events={selectedDate ? getEventsForDate(selectedDate) : []}
        onAddEvent={(title, date) => addEvent(title, date)}
        onDeleteEvent={deleteEvent}
        onToggleEvent={toggleEvent}
        onUpdateEvent={updateEvent}
        isCollapsed={rightSidebarCollapsed}
        onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
      />
    </div>
  )
}
