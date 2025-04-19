'use server'

import {getJobsByUserId} from "@/actions/jobs";
import JobsList from "@/app/admin/_components/jobsList";

const AdminJobsPage = async () => {
    const jobs = await getJobsByUserId()

    return (
        <div className="p-6">
            <JobsList jobs={jobs} />
        </div>
    )
}

export default AdminJobsPage