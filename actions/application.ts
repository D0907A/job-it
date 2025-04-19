"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {JobApplicationSchema} from "@/schemas";
// import {ApplicationStatus} from "@prisma/client";

export async function createJobApplication(data: unknown) {
    // Create a mutable copy of the data.
    const inputData = typeof data === "object" && data !== null ? { ...data } : {};

    // Retrieve the current user.
    const user = await currentUser();

    // Set the userId accordingly.
    if (user) {
        (inputData as any).userId = user.id;
    }
    // Validate incoming data using Zod.
    const parsed = JobApplicationSchema.safeParse(inputData);
    if (!parsed.success) {
        throw new Error(JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    // Build the data object for Prisma.
    const createData: any = {
        applicantName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        coverLetter: parsed.data.coverLetter,
        resumeUrl: parsed.data.resumeUrl,
        jobVacancy: {
            connect: { id: parsed.data.jobVacancyId },
        },
    };

    if (parsed.data.userId) {
        createData.user = { connect: { id: parsed.data.userId } };
    }

    try {
        const application = await db.jobApplication.create({ data: createData });
        return { success: "Application created successfully", data: application };
    } catch (error) {
        console.error("Error creating job application:", error);
        throw error;
    }
}

export async function getApplicationsForUserJobs() {
    const user = await currentUser();
    if (!user) {
        return [];
    }

    const applications = await db.jobApplication.findMany({
        where: {
            jobVacancy: {
                authorId: user.id,
            },
        },
        select: {
            id: true,
            applicantName: true,
            email: true,
            phone: true,
            coverLetter: true,
            resumeUrl: true,
            createdAt: true,
            jobVacancy: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return applications;
}

export async function updateApplicationStatus(
    applicationId: string,
    status
) {
    const updated = await db.jobApplication.update({
        where: { id: applicationId },
        data: { status },
    });
    return updated;
}
