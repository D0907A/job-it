"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export function SiteHeader() {
    const pathname = usePathname()

    const segments = pathname
        .split("/")
        .filter((s) => s && s !== "panel")

    const breadcrumbLinks = segments.map((segment, index) => {
        const href = "/panel/" + segments.slice(0, index + 1).join("/")
        return { name: segment, href }
    })

    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <div className="flex items-center text-sm text-muted-foreground space-x-1">
                    <span className="font-medium text-foreground">Panel</span>
                    {breadcrumbLinks.map((segment, i) => (
                        <div key={i} className="flex items-center space-x-1">
                            <span>/</span>
                            <Link
                                href={segment.href}
                                className={i === breadcrumbLinks.length - 1
                                    ? "font-semibold text-foreground"
                                    : "hover:underline"}
                            >
                                {segment.name.charAt(0).toUpperCase() + segment.name.slice(1)}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    )
}
