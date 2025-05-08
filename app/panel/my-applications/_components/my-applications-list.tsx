"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Application {
    id: string;
    applicantName: string;
    email: string;
    phone?: string;
    coverLetter: string;
    resumeUrl?: string;
    createdAt: string;
    jobVacancy?: {
        title: string;
    };
    status: string;
}

interface MyApplicationsClientProps {
    applications: Application[];
}

const statusSteps = ["NEW", "PENDING", "INTERVIEW", "ACCEPTED"];
const allStatuses = ["ALL", "NEW", "PENDING", "INTERVIEW", "ACCEPTED", "REJECTED", "STARRED"];

const getStepIndex = (status: string) => {
    const index = statusSteps.indexOf(status);
    return index !== -1 ? index : 0;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export function MyApplicationsList({ applications }: MyApplicationsClientProps) {
    const [selectedStatus, setSelectedStatus] = useState("ALL");

    const filteredApplications = selectedStatus === "ALL"
        ? applications
        : applications.filter((app) => app.status === selectedStatus);

    if (!applications.length) {
        return (
            <div>
                <p className="text-center text-muted-foreground">
                    You have not applied to any jobs yet.
                </p>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">My Applications</h1>

                    {/* Sort/Filter Select */}
                    <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {allStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredApplications.map((application) => {
                        const isRejected = application.status === "REJECTED";
                        const stepIndex = getStepIndex(application.status);

                        return (
                            <div
                                key={application.id}
                                className="border rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4"
                            >
                                <div>
                                    <Link href={`/portal/jobs?job=${application.jobVacancy?.id}`}>
                                        <h2 className="text-xl font-bold">{application.jobVacancy?.title || "Unknown Job"}</h2>
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        Applied on {formatDate(application.createdAt)}
                                    </p>
                                </div>

                                {/* Progress Steps */}
                                <div className="flex items-center justify-between mt-4">
                                    {!isRejected ? (
                                        statusSteps.map((step, index) => (
                                            <div key={step} className="flex-1 flex items-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`w-6 h-6 rounded-full text-xs flex items-center justify-center cursor-pointer
                                ${index <= stepIndex ? "bg-primary text-white" : "bg-gray-300 text-gray-500"}
                              `}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{step}</TooltipContent>
                                                </Tooltip>

                                                {index < statusSteps.length - 1 && (
                                                    <div
                                                        className={`flex-1 h-1 ${
                                                            index < stepIndex ? "bg-primary" : "bg-gray-300"
                                                        }`}
                                                    ></div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold">
                                                        ✖
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>Rejected</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 text-center text-sm font-medium">
                                    Current status: {application.status}
                                </div>

                                <div className="mt-2">
                                    <p className="font-semibold">Cover Letter:</p>
                                    <p className="text-sm line-clamp-3">{application.coverLetter}</p>
                                </div>

                                {application.resumeUrl && (
                                    <div className="mt-2">
                                        <a
                                            href={application.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-sm"
                                        >
                                            View Resume
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
}
