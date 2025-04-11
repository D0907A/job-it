import { getJobById } from '@/actions/jobs'
import JobForm from '@/app/admin/_components/job-form'
import CardLayout from '../../_components/admin-card-layout'
import { notFound } from 'next/navigation'

interface JobPageProps {
    params: { jobId: string }
}

export default async function JobPage({ params }: JobPageProps) {
    const { jobId } = params

    if (jobId === 'new') {
        return (
            <CardLayout title="Create Job" backUrl="/admin/jobs">
                <JobForm job={null} />
            </CardLayout>
        )
    }

    const job = await getJobById(jobId)
    if (!job) return notFound()

    return (
        <CardLayout title="Edit Job" backUrl="/admin/jobs">
            <JobForm job={job} />
        </CardLayout>
    )
}
