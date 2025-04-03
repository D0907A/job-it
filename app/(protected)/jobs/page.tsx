import {getJobsByUserId} from "@/actions/jobs";
import JobsList from "@/app/(protected)/_components/jobsList";

const JobsAdminPage = async () => {
    const jobs = await getJobsByUserId()

    return (
        <JobsList jobs={jobs}/>
    )
}

export default JobsAdminPage;