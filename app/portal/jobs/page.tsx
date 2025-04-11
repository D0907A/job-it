'use client'

import { useEffect, useState } from 'react'
import { getAllPublicJobs } from '@/actions/jobs'
import {JobsList} from "@/app/portal/_components/job-list";
import {JobDetailsPanel} from "@/app/portal/_components/job-details-panel";
import {JobDetailsDrawer} from "@/app/portal/_components/jobs-details-drawer";


export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([])
    const [selectedJob, setSelectedJob] = useState<any | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getAllPublicJobs()
                setJobs(data)
            } catch (error) {
                console.error('Failed to fetch jobs:', error)
            }
        }
        fetchJobs()
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="flex max-w-[1200px] mx-auto h-[calc(100vh-100px)] px-4 gap-6">
            {/* Left panel: Job list */}
            <div
                className={`transition-all duration-300 ease-in-out ${
                    selectedJob && !isMobile ? 'w-1/2' : 'w-full'
                }`}
            >
                <JobsList
                    jobs={jobs}
                    selectedJob={selectedJob}
                    onSelectJob={setSelectedJob}
                />
            </div>

            {/* Right panel or Drawer */}
            {selectedJob && (
                <>
                    {/* Desktop panel */}
                    {!isMobile && (
                        <JobDetailsPanel
                            job={selectedJob}
                            onClose={() => setSelectedJob(null)}
                        />
                    )}

                    {/* Mobile drawer */}
                    {isMobile && (
                        <JobDetailsDrawer
                            job={selectedJob}
                            onClose={() => setSelectedJob(null)}
                        />
                    )}
                </>
            )}
        </div>
    )
}
