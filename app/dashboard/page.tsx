import CalendarNew from "./calendar-new"
import { AuthGuardNew } from "@/components/auth-guard-new"

export default function Page() {
  return (
    <AuthGuardNew requireAuth={true}>
      <CalendarNew />
    </AuthGuardNew>
  )
}
