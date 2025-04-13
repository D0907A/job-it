'use client'

import { JobCard } from '@/app/portal/_components/job-card'

interface JobsListProps {
    jobs: any[]
    onSelectJob: (job: any) => void
    selectedJob: any | null
    onLoadMore?: () => void
    hasMore?: boolean
}

export function JobsList({
                             jobs,
                             onSelectJob,
                             selectedJob,
                             onLoadMore,
                             hasMore,
                         }: JobsListProps) {
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

            {/* Load More Button */}
            {hasMore && onLoadMore && (
                <div className="flex justify-center pt-6">
                    <button
                        onClick={onLoadMore}
                        className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition duration-300"
                    >
                        Завантажити ще
                    </button>
                </div>
            )}
        </div>
    )
}
