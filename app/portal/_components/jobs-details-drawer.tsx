'use client'

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { JobDetails } from '@/app/portal/_components/job-details'

interface JobDetailsDrawerProps {
    job: any
    onClose: () => void
}

export function JobDetailsDrawer({ job, onClose }: JobDetailsDrawerProps) {
    return (
        <Drawer
            open={!!job}
            onOpenChange={(open) => !open && onClose()}
        >
            <DrawerContent className="px-4 pt-6 pb-8">
                <DrawerHeader className="flex justify-between items-center">
                    <DrawerTitle className="text-lg font-bold">
                        {job?.title}
                    </DrawerTitle>
                    <DrawerClose className="text-sm text-muted-foreground hover:underline">
                        Закрити
                    </DrawerClose>
                </DrawerHeader>
                <div className="mt-2">
                    <JobDetails job={job} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
