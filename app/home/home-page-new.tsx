"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckSquare, Zap, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DemoCalendar from "./demo-calendar"
import { LoginDialogNew } from "@/components/login-dialog-new"
import { AuthGuardNew } from "@/components/auth-guard-new"

export default function HomePageNew() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  // Add keyboard shortcut to access admin panel (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        window.open("/admin/waitlist", "_blank")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleOpenLoginDialog = () => {
    setIsLoginDialogOpen(true)
  }

  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Beautiful monthly view with intuitive date selection and event management.",
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Organize daily events and monthly tasks with completion tracking.",
    },
    {
      icon: Zap,
      title: "Radically Simple",
      description: "No time slots, no notifications, no complexity. Just you and your tasks in a clutter-free space.",
    },
    {
      icon: X,
      title: "Zero Distractions",
      description: "No alerts, no integrations, no feature bloat. Focus purely on what matters to you.",
    },
  ]

  return (
    <AuthGuardNew requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Login Dialog */}
        <LoginDialogNew isOpen={isLoginDialogOpen} onClose={() => setIsLoginDialogOpen(false)} />

        {/* Header */}
        <header className="bg-gray-50 border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium text-gray-900">Linear Calendar</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleOpenLoginDialog} className="bg-gray-900 hover:bg-gray-800">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section - Centered Text */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-gray-100 text-gray-700 border-gray-200 text-lg">
              ✨ The Simple Digital Calendar
            </Badge>
            <h1 className="text-4xl md:text-6xl text-gray-900 mb-6">
              <span className="font-normal">Your Favorite</span>
              <span className="font-bold"> Paper Calendar</span>,
              <br />
              <span className="font-light text-gray-600">Reimagined Digitally</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              A clean, intuitive calendar application that helps you organize your daily and monthly tasks with ease.
              Built for productivity and designed for simplicity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleOpenLoginDialog}
                className="text-lg px-8 py-3 bg-gray-900 hover:bg-gray-800"
              >
                Try it Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4 font-light">Completely free. No subscriptions.</p>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-2">Try it yourself</h2>
              <p className="text-gray-600 font-light">Click around, add tasks, and experience the simplicity</p>
            </div>

            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
              <DemoCalendar />
            </div>
          </div>
        </section>

        {/* How it Works Section - Integrated with Demo */}
        <section className="pt-8 pb-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Monthly Tasks */}
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Monthly Tasks</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Collapsible left sidebar for your broader monthly goals. Keep track of what you want to accomplish
                  this month.
                </p>
              </div>

              {/* Calendar View */}
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Calendar View</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Clean, central calendar view. Click any day to focus on that date's tasks. Just like writing in a
                  paper calendar.
                </p>
              </div>

              {/* Daily Tasks */}
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Daily Tasks</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Collapsible right sidebar for specific daily tasks. Select any date to see and manage what's planned
                  for that day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-40 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Everything you NEED to stay organized.</h2>
              <p className="text-xl text-gray-600 font-light">Rediscover the joy of simple, focused task management</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-sm flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section with CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Inspiration</h2>
            <blockquote className="text-base text-gray-600 font-light leading-relaxed italic mb-12">
              "There was a certain comfort in the tangible. The smooth paper, the quick flick of the wrist to a new day,
              the immediate visual of your commitments laid out. We felt the loss of that intuitive experience in the
              overwhelming complexity of modern digital calendars. Linear Calendar is our answer – a digital space that
              honors that tactile simplicity, giving your tasks room to breathe, free from the suffocating clutter of
              the digital world."
            </blockquote>

            {/* CTA moved from the black section */}
            <h3 className="text-2xl font-light mb-6">Rediscover focused task management</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleOpenLoginDialog}
                className="text-lg px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white"
              >
                Get Your Free Linear Calendar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4 font-light">Completely free. No subscriptions. Forever.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <span className="text-lg font-medium text-gray-900">Linear Calendar</span>
              </div>
              <p className="text-gray-600 font-light">© 2025 Linear Calendar. Built with simplicity in mind.</p>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuardNew>
  )
}
