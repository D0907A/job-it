'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BeatLoader } from 'react-spinners'
import { Briefcase, Calendar, Copy, DollarSign, Laptop, Trash } from 'lucide-react'
import CardLayout from '../_components/admin-card-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { deleteJob, duplicateJob } from '@/actions/jobs'

export default function JobsList({ jobs }: { jobs: any[] }) {
    const [jobList, setJobList] = useState(jobs)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

    const handleDeleteJob = async (jobId: string) => {
        setDeletingId(jobId)
        try {
            await deleteJob(jobId)
            setJobList((prev) => prev.filter((job) => job.id !== jobId))
        } catch (err) {
            console.error('Failed to delete job:', err)
        } finally {
            setDeletingId(null)
        }
    }

    const handleDuplicateJob = async (jobId: string) => {
        setDuplicatingId(jobId)
        try {
            const duplicated = await duplicateJob(jobId)
            setJobList((prev) => [duplicated, ...prev])
        } catch (err) {
            console.error('Failed to duplicate job:', err)
        } finally {
            setDuplicatingId(null)
        }
    }

    return (
        <CardLayout title="My Job Listings" createHref="jobs/new" backUrl="/dashboard">
            {jobList.length === 0 ? (
                <p className="text-muted-foreground text-center">No job listings found.</p>
            ) : (
                jobList.map((job) => (
                    <div
                        key={job.id}
                        className="relative flex flex-col gap-4 border rounded-xl p-5 shadow-md hover:shadow-lg hover:border-primary/20 transition bg-white"
                    >
                        {/* Title & Status */}
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                                <Link href={`jobs/${job.id}`}>
                                    <h3 className="text-lg font-semibold text-foreground hover:underline hover:text-primary transition-colors">
                                        {job.title}
                                    </h3>
                                </Link>
                                <Badge
                                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                        job.isActive ? 'bg-emerald-500 text-white' : 'bg-destructive text-white'
                                    }`}
                                >
                                    {job.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDuplicateJob(job.id)}
                                    disabled={duplicatingId === job.id}
                                    className="gap-1"
                                >
                                    {duplicatingId === job.id ? (
                                        <BeatLoader size={8} color="black" />
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Duplicate
                                        </>
                                    )}
                                </Button>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={deletingId === job.id}
                                        >
                                            {deletingId === job.id ? (
                                                <BeatLoader size={8} color="white" />
                                            ) : (
                                                <>
                                                    <Trash className="w-4 h-4 mr-1" />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-4 space-y-3 bg-background rounded-md shadow-md">
                                        <p className="text-sm text-muted-foreground">
                                            Are you sure you want to delete this job?
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => document.activeElement?.blur()}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteJob(job.id)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {job.employmentType}
                            </div>
                            <div className="flex items-center gap-1">
                                <Laptop className="w-4 h-4" />
                                {job.workingType}
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.paymentFrom} - {job.paymentTo} PLN
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Until: {new Date(job.validUntil).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Skills */}
                        {job.jobSkills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {job.jobSkills.map((js: any) => (
                                    <Badge
                                        key={js.id}
                                        variant="secondary"
                                        className="px-2 py-1 text-xs font-medium rounded-full"
                                    >
                                        {js.skill}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </CardLayout>
    )
}
