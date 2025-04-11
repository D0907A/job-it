'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CardLayoutProps {
    title: string
    onCreate?: () => void
    createHref?: string
    backUrl?: string
    children: React.ReactNode
}

export default function CardLayout({
                                       title,
                                       onCreate,
                                       createHref,
                                       backUrl,
                                       children
                                   }: CardLayoutProps) {
    return (
        <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-150px)] shadow-lg rounded-2xl border border-border/50 flex flex-col">
            <CardHeader className="flex flex-col items-center justify-between sm:flex-row bg-gradient-to-r from-primary/10 to-muted/20 rounded-t-2xl px-6 py-4 gap-3 sm:gap-0">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {backUrl && (
                        <Link href={backUrl}>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                    )}
                    <p className="text-2xl font-bold tracking-tight text-foreground">{title}</p>
                </div>
                {createHref && (
                    <Link href={createHref}>
                        <Button className="mt-2 sm:mt-0">Add New</Button>
                    </Link>
                )}
                {onCreate && !createHref && (
                    <Button className="mt-2 sm:mt-0" onClick={onCreate}>Add New</Button>
                )}
            </CardHeader>

            <CardContent className="overflow-y-auto flex-1 p-6 space-y-5 bg-background rounded-b-2xl">
                {children}
            </CardContent>
        </Card>
    )
}
