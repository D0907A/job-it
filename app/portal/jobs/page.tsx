"use client";

import { useEffect, useState } from "react";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";

import { getJobs } from "@/actions/jobs";
import { JobsList } from "@/app/portal/_components/job-list";
import { JobDetailsPanel } from "@/app/portal/_components/job-details-panel";
import { JobDetailsDrawer } from "@/app/portal/_components/jobs-details-drawer";
import { JobFilters } from "@/app/portal/_components/job-filter";

export default function JobsPage() {
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [offset, setOffset] = useState(0);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Extract filters from URL on mount
    const getFiltersFromParams = () => {
        const entries = Array.from(searchParams.entries());
        const filters: Record<string, any> = {};

        for (const [key, value] of entries) {
            if (key === "title") {
                filters[key] = value;
            } else {
                filters[key] = value.split(",");
            }
        }

        return filters;
    };

    const [filters, setFilters] = useState(getFiltersFromParams());

    // Handle screen size
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Load initial jobs
    useEffect(() => {
        loadJobs(0, true);
    }, [filters]);

    const handleSelectJob = async (job) => {
        setSelectedJob(job);
        router.push(`${pathname}?${searchParams.toString()}&job=${job.id}`);
    };

    const handleClose = () => {
        setSelectedJob(null);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("job");

        router.replace(`${pathname}?${params.toString()}`);
    };

    const loadJobs = async (startOffset = offset, reset = false) => {
        setIsLoading(true);
        const fetchedJobs = await getJobs(startOffset, 5, filters);

        setJobs(prev => {
            const combined = reset ? fetchedJobs : [...prev, ...fetchedJobs];
            const unique = new Map();
            for (const job of combined) {
                unique.set(job.id, job);
            }
            return Array.from(unique.values());
        });

        setOffset(startOffset + 5);
        setIsLoading(false);
    };

    const applyFilters = (newFilters: Record<string, any>) => {
        setFilters(newFilters);

        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(newFilters)) {
            if (Array.isArray(value) && value.length > 0) {
                params.set(key, value.join(","));
            } else if (typeof value === "string" && value.trim() !== "") {
                params.set(key, value);
            }
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <JobFilters filters={filters} onChange={applyFilters} />

            <div className="flex max-w-[1200px] mx-auto h-[calc(100vh-300px)] px-4 gap-6">
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
                    <div className="flex justify-center pt-6">
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <button
                                onClick={() => loadJobs()}
                                className="px-6 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition duration-300"
                            >
                                Завантажити ще
                            </button>
                        )}
                    </div>
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
