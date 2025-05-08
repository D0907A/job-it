"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useCurrentRole} from "@/hooks/use-current-role";

export function NavMain({
                          items,
                        }: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  const userRole = useCurrentRole();
  console.log(userRole)

  return (
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          {/* Quick Create + Inbox */}
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              {userRole!='USER' && (
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 active:bg-primary/90"
              >
                <PlusCircleIcon className="h-4 w-4"/>
                  <Link href={"/panel/jobs/new"}>
                    <span>Quick Create</span>
                  </Link>
                </SidebarMenuButton>
              )}
              {/*<Button*/}
              {/*    size="icon"*/}
              {/*    className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"*/}
              {/*    variant="outline"*/}
              {/*>*/}
              {/*  <MailIcon className="h-4 w-4" />*/}
              {/*  <span className="sr-only">Inbox</span>*/}
              {/*</Button>*/}
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Navigation Items */}
          <SidebarMenu>
            {items.map((item) => {
              const isActive = pathname === item.url

              return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={isActive ? "bg-muted text-foreground" : ""}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
  )
}
