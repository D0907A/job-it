'use client'

import { JobCard } from '@/app/portal/_components/job-card'

interface JobsListProps {
    jobs: any[]
    onSelectJob: (job: any) => void
    selectedJob: any | null
}

export function JobsList({ jobs, onSelectJob, selectedJob }: JobsListProps) {
    return (
        <div className="space-y-4 overflow-y-auto h-full p-12">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="cursor-pointer"
                >
                    <JobCard
                        id={job.id}
                        title={job.title}
                        salary={`${job.paymentFrom} – ${job.paymentTo} грн`}
                        company={job.company.name}
                        location={job.company.location || 'Не вказано'}
                        description={job.description}
                        isHot={job.title.toLowerCase().includes('sql')}
                        logoUrl={job.company.logoUrl}
                        skills={job.jobSkills?.map((s: any) => s.skill) || []}
                        employmentType={job.employmentType}
                        workingType={job.workingType}
                        validUntil={job.validUntil}
                        authorId={job.authorId}
                        selected={selectedJob?.id === job.id}
                    />
                </div>
            ))}
        </div>
    )
}
