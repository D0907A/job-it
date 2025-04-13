"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllPublicJobs } from "@/actions/jobs";
import { JobsList } from "@/app/portal/_components/job-list";
import { JobDetailsPanel } from "@/app/portal/_components/job-details-panel";
import { JobDetailsDrawer } from "@/app/portal/_components/jobs-details-drawer";

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getAllPublicJobs();
                setJobs(data);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    // On jobs fetch, read the query parameter and pre-select job if available.
    useEffect(() => {
        const jobId = searchParams.get("job");
        if (jobId && jobs.length > 0) {
            const found = jobs.find((job) => job.id === jobId);
            if (found) {
                setSelectedJob(found);
            }
        }
    }, [jobs, searchParams]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // When a job is selected, update state and add its id to the URL.
    const handleSelectJob = (job: any) => {
        setSelectedJob(job);
        // Update the URL query param without a full page refresh.
        router.push(`?job=${job.id}`);
    };

    return (
        <div className="flex max-w-[1200px] mx-auto h-[calc(100vh-100px)] px-4 gap-6">
            {/* Left panel: Job list */}
            <div
                className={`transition-all duration-300 ease-in-out ${
                    selectedJob && !isMobile ? "w-1/2" : "w-full"
                }`}
            >
                <JobsList
                    jobs={jobs}
                    selectedJob={selectedJob}
                    onSelectJob={handleSelectJob}
                />
            </div>

            {/* Right panel or Drawer */}
            {selectedJob && (
                <>
                    {/* Desktop panel */}
                    {!isMobile && (
                        <JobDetailsPanel
                            job={selectedJob}
                            onClose={() => {
                                setSelectedJob(null);
                                router.push(""); // Remove query from URL when closed.
                            }}
                        />
                    )}

                    {/* Mobile drawer */}
                    {isMobile && (
                        <JobDetailsDrawer
                            job={selectedJob}
                            onClose={() => {
                                setSelectedJob(null);
                                router.push("");
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}
