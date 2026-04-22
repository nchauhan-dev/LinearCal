import { redirect } from "next/navigation"

export default function RootPage() {
  // Redirect root to dashboard (no login needed for desktop app)
  redirect("/dashboard/calendar-new")
}
