import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ParentSidebar } from "@/components/parent/ParentSidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ParentSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
