'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { BeatLoader } from 'react-spinners'
import Link from 'next/link'
import {deleteJob, duplicateJob} from '@/actions/jobs'
import { Badge } from '@/components/ui/badge'
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

export default function JobsList({ jobs }: { jobs: any[] }) {
    const [jobList, setJobList] = useState(jobs)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [jobToDelete, setJobToDelete] = useState<any>(null)
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
        <Card className="w-full max-w-3xl mx-auto h-[calc(100vh-200px)] shadow-md flex flex-col">
            <CardHeader className="flex flex-col items-center justify-between sm:flex-row shrink-0">
                <p className="text-2xl font-semibold">My Job Listings</p>
                <Link href="/jobs/new">
                    <Button>Add new</Button>
                </Link>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 space-y-4">
                {jobList.length === 0 && (
                    <p className="text-muted-foreground text-center">No job listings found.</p>
                )}

                {jobList.map((job) => (
                    <div
                        key={job.id}
                        className="relative flex flex-col gap-2 border rounded-lg p-4 shadow-sm hover:bg-muted transition"
                    >
                        {/* Status Badge */}
                        <div className="absolute bottom-3 right-3">
                            <Badge className={job.isActive ? "bg-emerald-500 text-white" : "bg-destructive text-white"}>
                                {job.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                        {/* Title & Company */}
                        <div className="flex justify-between items-start">
                            <div>
                                <Link href={`/jobs/${job.id}`}>
                                    <h3 className="text-lg font-semibold hover:underline">{job.title}</h3>
                                </Link>
                                <p className="text-sm text-muted-foreground">{job.company?.name || 'No company'}</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDuplicateJob(job.id)}
                                disabled={duplicatingId === job.id}
                            >
                                {duplicatingId === job.id ? (
                                    <BeatLoader size={8} color="black" />
                                ) : (
                                    <>📄 Duplicate</>
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
                                <PopoverContent className="w-auto p-4 space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        Are you sure you want to delete this job?
                                    </p>
                                    <div className="flex justify-around space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                document.activeElement?.blur();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteJob(job.id)}
                                            variant="destructive"
                                            size="sm"
                                            disabled={deletingId === job.id}
                                        >
                                            {deletingId === job.id ? (
                                                <BeatLoader size={8} color="white" />
                                            ) : (
                                                <>
                                                    <Trash className="w-4 h-4 mr-1" />
                                                    Confirm
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="text-sm flex flex-wrap gap-2 text-muted-foreground">
                            <span>💼 {job.employmentType}</span>
                            <span>🧑‍💻 {job.workingType}</span>
                            <span>💰 {job.paymentFrom} - {job.paymentTo} PLN</span>
                            <span>📅 Until: {new Date(job.validUntil).toLocaleDateString()}</span>
                        </div>

                        {/* Skills */}
                        {job.jobSkills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {job.jobSkills.map((js: any) => (
                                    <Badge key={js.id} variant="secondary">
                                        {js.skill}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
