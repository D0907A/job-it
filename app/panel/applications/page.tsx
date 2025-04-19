// app/portal/applications/page.tsx
import { getApplicationsForUserJobs } from "@/actions/application";
import ApplicationsList from "@/app/panel/_components/applications-list";

export default async function ApplicationsPage() {
    const initialApps = await getApplicationsForUserJobs();
    return <ApplicationsList initialApps={initialApps} />;
}
