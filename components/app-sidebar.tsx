"use client"

import * as React from "react"
import {
  ClipboardListIcon,
  FolderIcon,
  ListIcon,
  ListChecksIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useCurrentUser } from "@/hooks/use-current-user"
import { RoleGate } from "@/components/auth/role-gate"
import { UserRole } from "@prisma/client"

const userMenu = [
  {
    title: "My Applications",
    url: "/panel/my-applications",
    icon: ListChecksIcon,
  },
]

const employerMenu = [
  {
    title: "Jobs",
    url: "/panel/jobs",
    icon: ListIcon,
  },
  {
    title: "Applications",
    url: "/panel/applications",
    icon: ClipboardListIcon,
  },
  {
    title: "Companies",
    url: "/panel/companies",
    icon: FolderIcon,
  },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser()

  return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="/portal/jobs">
                  <span className="text-base font-semibold">Jobs-it</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* Show user menu if role is USER */}
          <RoleGate allowedRoles={[UserRole.USER]} silent={true}>
            <NavMain items={userMenu} />
          </RoleGate>

          {/* Show employer menu if role is EMPLOYER or ADMIN */}
          <RoleGate allowedRoles={[UserRole.EMPLOYER, UserRole.ADMIN]} silent={true}>
            <NavMain items={employerMenu} />
          </RoleGate>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
  )
}
