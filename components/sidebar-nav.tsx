import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex w-[200px] flex-col border-r px-4 py-6">
      <div className="space-y-1">
        {sidebarNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className={cn("w-full justify-start gap-2", pathname === item.href && "bg-muted")}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}

