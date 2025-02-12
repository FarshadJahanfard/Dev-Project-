"use client"
import { MobileNav } from "@/components/mobile-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <MobileNav />
            <Link href="/admin" className="text-lg font-playfair font-bold text-primary">
              ZenFlow Admin
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/#reservation-form">
              <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-primary">
                New Booking
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would call a logout API
                window.location.href = "/admin/login"
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <SidebarNav />
        <main className="flex-1 p-4 md:p-6 bg-muted/50">{children}</main>
      </div>
    </div>
  )
}

