import { getJobById } from "@/actions/jobs"
import JobForm from "@/app/(protected)/_components/job-form";

export default async function JobPage({ params }: { params: { jobId: string } }) {
    const job = params.jobId === "new" ? null : await getJobById(params.jobId)
    return <JobForm job={job} />
}
