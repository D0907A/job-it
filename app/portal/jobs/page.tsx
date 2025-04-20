"use client";

import { useEffect, useState } from "react";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";

import { getAllPublicJobs } from "@/actions/jobs";
import { JobsList } from "@/app/portal/_components/job-list";
import { JobDetailsPanel } from "@/app/portal/_components/job-details-panel";
import { JobDetailsDrawer } from "@/app/portal/_components/jobs-details-drawer";
import { JobFilters } from "@/app/portal/_components/job-filter";

const PAGE_SIZE = 2;

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({});

    const router = useRouter();
    const pathname = usePathname();          //  NEW
    const searchParams = useSearchParams();

    /* ---------- data loading ---------- */

    const loadJobs = async (newOffset = 0, newFilters = filters) => {
        try {
            const data = await getAllPublicJobs(newOffset, PAGE_SIZE, newFilters);

            if (newOffset === 0) {
                setJobs(data);
                setHasMore(data.length === PAGE_SIZE);
            } else {
                setJobs((prev) => [...prev, ...data]);
                if (data.length < PAGE_SIZE) setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
        }
    };

    useEffect(() => {
        loadJobs(0);
        setOffset(PAGE_SIZE);
    }, []);

    /* ---------- URL → state sync ---------- */

    useEffect(() => {
        const jobId = searchParams.get("job");
        if (jobId && jobs.length) {
            const found = jobs.find((j) => j.id === jobId);
            if (found) setSelectedJob(found);
        }
    }, [jobs, searchParams]);

    /* ---------- responsive check ---------- */

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* ---------- helpers ---------- */

    const handleSelectJob = (job: any) => {
        setSelectedJob(job);
        router.push(`?job=${job.id}`);
    };

    const handleClose = () => {              //  NEW
        setSelectedJob(null);
        router.replace(pathname);              //  removes the entire query‑string
    };

    const handleLoadMore = () => {
        loadJobs(offset);
        setOffset((prev) => prev + PAGE_SIZE);
    };

    return (
        <>
            <JobFilters
                filters={filters}
                onChange={(newFilters) => {
                    setFilters(newFilters);
                    setOffset(PAGE_SIZE);
                    setHasMore(true);
                    loadJobs(0, newFilters);
                }}
            />

            <div className="flex max-w-[1200px] mx-auto h-[calc(100vh-100px)] px-4 gap-6">
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

                {selectedJob && (
                    <>
                        {!isMobile ? (
                            <JobDetailsPanel job={selectedJob} onClose={handleClose} />
                        ) : (
                            <JobDetailsDrawer job={selectedJob} onClose={handleClose} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
