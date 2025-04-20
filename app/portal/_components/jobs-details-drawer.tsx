'use client'

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { JobDetails } from '@/app/portal/_components/job-details'
import JobApplicationPanel from "@/app/portal/_components/job-application-panel";

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
            <DrawerContent className="px-4 pt-6 pb-8 flex flex-col h-full">
                <DrawerHeader className="flex justify-between items-center flex-shrink-0">
                    <DrawerTitle className="text-lg font-bold">
                        {job?.title}
                    </DrawerTitle>
                    <DrawerClose className="text-sm text-muted-foreground hover:underline">
                        Закрити
                    </DrawerClose>
                </DrawerHeader>

                {/* Scrollable content */}
                <div className="mt-2 overflow-y-auto flex-1 space-y-6">
                    <JobDetails job={job} />
                    <JobApplicationPanel jobAuthorId={job.authorId}/>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
