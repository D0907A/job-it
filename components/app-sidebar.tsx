"use client"

import * as React from "react"
import {
  ClipboardListIcon,
  FolderIcon,
  ListIcon,
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

const navMain = [
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser();

  return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <span className="text-base font-semibold">Jobs-it</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
  )
}
