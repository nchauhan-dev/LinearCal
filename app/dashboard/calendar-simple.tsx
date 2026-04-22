"use client"

import { useState, useEffect } from "react"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarGrid } from "@/components/calendar-grid"
import { DateDetailPanel } from "@/components/date-detail-panel"
import { MonthlyTasksSidebarSimple } from "@/components/monthly-tasks-sidebar-simple"
import { EventForm } from "@/components/event-form"
import { ConnectionStatus } from "@/components/connection-status"
import { useCalendarEventsSimple } from "@/hooks/use-calendar-events-simple"
import { getFromLocalStorage, setToLocalStorage, LOCAL_STORAGE_KEYS } from "@/lib/local-storage"

export default function CalendarSimple() {
  const { events, loading, error, addEvent, deleteEvent, toggleEvent, updateEvent, getEventsForDate } =
    useCalendarEventsSimple()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [eventFormOpen, setEventFormOpen] = useState(false)
  const [eventFormDate, setEventFormDate] = useState<Date>(new Date())
  const [isMobile, setIsMobile] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowRightSidebar(!mobile)

      const savedStates = getFromLocalStorage<{
        leftCollapsed: boolean
        rightCollapsed: boolean
      }>(LOCAL_STORAGE_KEYS.SIDEBAR_STATES)

      if (savedStates && !mobile) {
        setLeftSidebarCollapsed(savedStates.leftCollapsed)
        setRightSidebarCollapsed(savedStates.rightCollapsed)
      } else {
        setLeftSidebarCollapsed(mobile)
        setRightSidebarCollapsed(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setToLocalStorage(LOCAL_STORAGE_KEYS.SIDEBAR_STATES, {
        leftCollapsed: leftSidebarCollapsed,
        rightCollapsed: rightSidebarCollapsed,
      })
    }
  }, [leftSidebarCollapsed, rightSidebarCollapsed, isMobile])

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
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const handleEventFormSubmit = async (title: string, description?: string) => {
    const result = await addEvent(title, eventFormDate, description)
    if (result.success) {
      console.log("Event added successfully!")
    } else {
      console.error("Failed to add event:", result.error)
    }
  }

  const handleAddEventFromPanel = async (title: string, date: Date) => {
    const result = await addEvent(title, date)
    if (!result.success) {
      console.error("Failed to add event:", result.error)
    }
  }

  const handleAddEventFromGrid = async (title: string, date: Date, description?: string) => {
    const result = await addEvent(title, date, description)
    if (!result.success) {
      console.error("Failed to add event:", result.error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    const result = await deleteEvent(eventId)
    if (!result.success) {
      console.error("Failed to delete event:", result.error)
    }
  }

  const handleToggleEvent = async (eventId: string, completed: boolean) => {
    const result = await toggleEvent(eventId, completed)
    if (!result.success) {
      console.error("Failed to toggle event:", result.error)
    }
  }

  const handleUpdateEvent = async (eventId: string, updates: any) => {
    const result = await updateEvent(eventId, updates)
    if (!result.success) {
      console.error("Failed to update event:", result.error)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    if (isMobile) {
      setShowRightSidebar(true)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dashboard-layout">
      <ConnectionStatus />

      <div className="flex flex-1">
        {/* Left Sidebar - Monthly Tasks */}
        {!isMobile && (
          <MonthlyTasksSidebarSimple
            currentDate={currentDate}
            isCollapsed={leftSidebarCollapsed}
            onToggleCollapse={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          />
        )}

        {/* Main Calendar */}
        <div className={`flex-1 flex flex-col ${isMobile && showRightSidebar ? "hidden" : "flex"}`}>
          <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-2 bg-white">
            <CalendarHeader
              currentDate={currentDate}
              onNavigate={navigateMonth}
              onToday={goToToday}
              onToggleSidebar={() => setShowRightSidebar(!showRightSidebar)}
              isMobile={isMobile}
            />
          </div>

          <div className="flex-1">
            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={events}
              onDateSelect={handleDateSelect}
              onAddEvent={handleAddEventFromGrid}
              onDeleteEvent={handleDeleteEvent}
              onToggleEvent={handleToggleEvent}
            />
          </div>
        </div>

        {/* Right Sidebar - Date Details */}
        {(showRightSidebar || rightSidebarCollapsed) && !isMobile && (
          <DateDetailPanel
            selectedDate={selectedDate}
            events={selectedDate ? getEventsForDate(selectedDate) : []}
            onAddEvent={handleAddEventFromPanel}
            onDeleteEvent={handleDeleteEvent}
            onToggleEvent={handleToggleEvent}
            onUpdateEvent={handleUpdateEvent}
            isCollapsed={rightSidebarCollapsed}
            onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          />
        )}

        {/* Mobile Right Sidebar */}
        {showRightSidebar && isMobile && (
          <DateDetailPanel
            selectedDate={selectedDate}
            events={selectedDate ? getEventsForDate(selectedDate) : []}
            onAddEvent={handleAddEventFromPanel}
            onDeleteEvent={handleDeleteEvent}
            onToggleEvent={handleToggleEvent}
            onUpdateEvent={handleUpdateEvent}
            onBack={() => setShowRightSidebar(false)}
          />
        )}
      </div>

      <EventForm
        isOpen={eventFormOpen}
        onClose={() => setEventFormOpen(false)}
        onSubmit={handleEventFormSubmit}
        selectedDate={eventFormDate}
      />
    </div>
  )
}
