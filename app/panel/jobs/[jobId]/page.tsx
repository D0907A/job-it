import { getJobById } from "@/actions/jobs";
import JobForm from "@/app/panel/_components/job-form";
import { notFound } from "next/navigation";

interface JobPageProps {
    params: { jobId: string };
}

export default async function JobPage({ params }: JobPageProps) {
    const jobId = params.jobId;

    if (jobId === 'new') {
        return <JobForm job={null} />;
    }

    const job = await getJobById(jobId);
    if (!job) return notFound();

    return <JobForm job={job} />;
}
