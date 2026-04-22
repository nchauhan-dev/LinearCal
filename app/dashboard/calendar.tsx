"use client"

import { useState, useEffect } from "react"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarGrid } from "@/components/calendar-grid"
import { DateDetailPanel } from "@/components/date-detail-panel"
import { MonthlyTasksSidebar } from "@/components/monthly-tasks-sidebar"
import { EventForm } from "@/components/event-form"
import { ConnectionStatus } from "@/components/connection-status"
import { DebugButton } from "@/components/debug-button"
import { useCalendar } from "@/hooks/use-calendar"
import { getFromLocalStorage, setToLocalStorage, LOCAL_STORAGE_KEYS } from "@/lib/local-storage"

export default function Calendar() {
  const {
    events,
    loading,
    currentDate,
    selectedDate,
    setSelectedDate,
    addEvent,
    deleteEvent,
    toggleEvent,
    updateEvent,
    getEventsForDate,
    navigateMonth,
    goToToday,
  } = useCalendar()

  const [eventFormOpen, setEventFormOpen] = useState(false)
  const [eventFormDate, setEventFormDate] = useState<Date>(new Date())
  const [isMobile, setIsMobile] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowRightSidebar(!mobile)

      // Load sidebar states from localStorage
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

    // Enable debug mode with keyboard shortcut (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setShowDebug((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Save sidebar states to localStorage
  useEffect(() => {
    if (!isMobile) {
      setToLocalStorage(LOCAL_STORAGE_KEYS.SIDEBAR_STATES, {
        leftCollapsed: leftSidebarCollapsed,
        rightCollapsed: rightSidebarCollapsed,
      })
    }
  }, [leftSidebarCollapsed, rightSidebarCollapsed, isMobile])

  const handleAddEvent = async (date: Date) => {
    setEventFormDate(date)
    setEventFormOpen(true)
  }

  const handleEventFormSubmit = async (title: string, description?: string) => {
    await addEvent(title, eventFormDate, description)
  }

  const handleAddEventFromPanel = async (title: string, date: Date) => {
    await addEvent(title, date)
  }

  const handleAddEventFromGrid = async (title: string, date: Date, description?: string) => {
    await addEvent(title, date, description)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    if (isMobile) {
      setShowRightSidebar(true)
    }
  }

  // Remove the loading state completely - show calendar immediately
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dashboard-layout">
      <ConnectionStatus />

      <div className="flex flex-1">
        {/* Left Sidebar - Monthly Tasks */}
        {!isMobile && (
          <MonthlyTasksSidebar
            currentDate={currentDate}
            isCollapsed={leftSidebarCollapsed}
            onToggleCollapse={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          />
        )}

        {/* Main Calendar */}
        <div className={`flex-1 flex flex-col ${isMobile && showRightSidebar ? "hidden" : "flex"}`}>
          {/* Header with padding */}
          <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-2 bg-white">
            <CalendarHeader
              currentDate={currentDate}
              onNavigate={navigateMonth}
              onToday={goToToday}
              onToggleSidebar={() => setShowRightSidebar(!showRightSidebar)}
              isMobile={isMobile}
            />

            {/* Debug button (hidden by default, press Ctrl+Shift+D to show) */}
            {showDebug && (
              <div className="mt-2">
                <DebugButton />
              </div>
            )}
          </div>

          {/* Calendar grid without any padding */}
          <div className="flex-1">
            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={events}
              onDateSelect={handleDateSelect}
              onAddEvent={handleAddEventFromGrid}
              onDeleteEvent={deleteEvent}
              onToggleEvent={toggleEvent}
            />
          </div>
        </div>

        {/* Right Sidebar - Date Details */}
        {(showRightSidebar || rightSidebarCollapsed) && !isMobile && (
          <DateDetailPanel
            selectedDate={selectedDate}
            events={selectedDate ? getEventsForDate(selectedDate) : []}
            onAddEvent={handleAddEventFromPanel}
            onDeleteEvent={deleteEvent}
            onToggleEvent={toggleEvent}
            onUpdateEvent={updateEvent}
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
            onDeleteEvent={deleteEvent}
            onToggleEvent={toggleEvent}
            onUpdateEvent={updateEvent}
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
