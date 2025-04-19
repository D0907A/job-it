import {getJobById} from "@/actions/jobs";
import CardLayout from "@/app/panel/_components/admin-card-layout";
import JobForm from "@/app/panel/_components/job-form";
import {notFound} from "next/navigation";
import {Card} from "@/components/ui/card";


interface JobPageProps {
    params: { jobId: string }
}

export default async function JobPage({ params }: JobPageProps) {
    const { jobId } = params

    if (jobId === 'new') {
        return (
            <div>
                <JobForm job={null}/>
            </div>
        );
    }

    const job = await getJobById(jobId)
    if (!job) return notFound()

    return (
        <div>
            <JobForm job={job} />
        </div>
    )
}
