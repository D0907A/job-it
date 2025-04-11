'use client'

import { X } from 'lucide-react'
import { JobDetails } from '@/app/portal/_components/job-details'
import JobApplicationPanel from "@/app/portal/_components/job-application-panel";

interface JobDetailsPanelProps {
    job: any
    onClose: () => void
}

export function JobDetailsPanel({ job, onClose }: JobDetailsPanelProps) {
    return (
        <div className="w-1/2 h-full overflow-y-auto bg-white shadow-xl rounded-xl p-6 relative animate-slide-in">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 hover:text-slate-400 text-white bg-slate-700 rounded-full p-2 transition"
                aria-label="Закрити"
            >
                <X className="w-5 h-5" />
            </button>
            <JobDetails job={job} />
            <JobApplicationPanel/>

        </div>
    )
}
