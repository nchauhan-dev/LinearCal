import CalendarSimple from "./calendar-simple"
import { AuthGuardNew } from "@/components/auth-guard-new"

export default function PageSimple() {
  return (
    <AuthGuardNew requireAuth={true}>
      <CalendarSimple />
    </AuthGuardNew>
  )
}
