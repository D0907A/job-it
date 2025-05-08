"use client";

import { useState } from "react";
import { getJobs } from "@/actions/jobs";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [offset, setOffset] = useState(0);

    const loadJobs = async () => {
        const fetchedJobs = await getJobs(offset, 5);
        setJobs(prevJobs => [...prevJobs, ...fetchedJobs]); // append new jobs
        setOffset(prevOffset => prevOffset + 5); // increment offset
    };

    return (
        <>
            <div onClick={loadJobs} style={{ cursor: "pointer", margin: "1rem 0", color: "blue" }}>
                Load more
            </div>

            <pre>
                {JSON.stringify(jobs, null, 2)}
            </pre>
        </>
    );
}
