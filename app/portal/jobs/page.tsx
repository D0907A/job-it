'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllPublicJobs } from "@/actions/jobs";
import { JobsList } from "@/app/portal/_components/job-list";
import { JobDetailsPanel } from "@/app/portal/_components/job-details-panel";
import { JobDetailsDrawer } from "@/app/portal/_components/jobs-details-drawer";

const PAGE_SIZE = 2;

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();

    const loadJobs = async (newOffset = 0) => {
        try {
            const data = await getAllPublicJobs(newOffset, PAGE_SIZE);
            if (data.length < PAGE_SIZE) setHasMore(false);
            if (newOffset === 0) {
                setJobs(data);
            } else {
                setJobs((prev) => [...prev, ...data]);
            }
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
    };

    useEffect(() => {
        loadJobs(0);
        setOffset(PAGE_SIZE);
    }, []);

    useEffect(() => {
        const jobId = searchParams.get("job");
        if (jobId && jobs.length > 0) {
            const found = jobs.find((job) => job.id === jobId);
            if (found) setSelectedJob(found);
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

    const handleSelectJob = (job: any) => {
        setSelectedJob(job);
        router.push(`?job=${job.id}`);
    };

    const handleLoadMore = () => {
        loadJobs(offset);
        setOffset((prev) => prev + PAGE_SIZE);
    };

    return (
        <div className="flex max-w-[1200px] mx-auto h-[calc(100vh-100px)] px-4 gap-6">
            {/* Left panel */}



            <div
                className={`transition-all duration-300 ease-in-out ${
                    selectedJob && !isMobile ? "w-1/2" : "w-full"
                }`}
            >
                <JobsList
                    jobs={jobs}
                    selectedJob={selectedJob}
                    onSelectJob={handleSelectJob}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                />
            </div>

            {/* Right panel or Drawer */}
            {selectedJob && (
                <>
                    {!isMobile && (
                        <JobDetailsPanel
                            job={selectedJob}
                            onClose={() => {
                                setSelectedJob(null);
                                router.push("");
                            }}
                        />
                    )}
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
