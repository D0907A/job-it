'use server';

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {JobApplicationSchema} from "@/schemas";

export async function createJobApplication(data: unknown) {
    const inputData = typeof data === "object" && data !== null ? { ...data } : {};

    const user = await currentUser();
    if (user) {
        (inputData as any).userId = user.id;
    }

    // Validate form input
    const parsed = JobApplicationSchema.safeParse(inputData);
    if (!parsed.success) {
        return {
            error: "Invalid form data",
            details: parsed.error.flatten().fieldErrors,
        };
    }

    // Build data for Prisma
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
        const application = await db.jobApplication.create({
            data: createData,
        });

        return {
            success: true,
            data: application,
        };
    } catch (error) {
        console.error("Error creating job application:", error);
        return { error: "Failed to create application" };
    }
}



export async function fetchApplicationsWithFilters(filters: { status?: string; name?: string }) {
    const user = await currentUser()
    if (!user) return []

    const where: any = {
        jobVacancy: { authorId: user.id },
    }

    if (filters.status) {
        where.status = filters.status
    }

    if (filters.name) {
        where.applicantName = {
            contains: filters.name,
            mode: 'insensitive',
        }
    }

    const apps = await db.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            applicantName: true,
            email: true,
            phone: true,
            coverLetter: true,
            resumeUrl: true,
            createdAt: true,
            status: true,
            jobVacancy: {
                select: { id: true, title: true },
            },
        },
    })

    return apps
}

export async function getApplicationsForUserJobs(filters?: { status?: string; name?: string }) {
    const user = await currentUser();
    if (!user) return [];

    const where: any = {
        jobVacancy: { authorId: user.id },
    };

    if (filters?.status) {
        where.status = filters.status;
    }

    if (filters?.name) {
        where.applicantName = {
            contains: filters.name,
            mode: 'insensitive',
        };
    }

    const applications = await db.jobApplication.findMany({
        where,
        select: {
            id: true,
            applicantName: true,
            email: true,
            phone: true,
            coverLetter: true,
            resumeUrl: true,
            createdAt: true,
            status: true,
            jobVacancy: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
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

export async function deleteApplication(applicationId: string) {
    const user = await currentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    // Ensure the application belongs to a job created by this user
    const application = await db.jobApplication.findUnique({
        where: { id: applicationId },
        include: {
            jobVacancy: {
                select: { authorId: true },
            },
        },
    });

    if (!application || application.jobVacancy.authorId !== user.id) {
        throw new Error("Not allowed to delete this application");
    }

    try {
        await db.jobApplication.delete({
            where: { id: applicationId },
        });

        return { success: "Application deleted successfully" };
    } catch (error) {
        console.error("Error deleting job application:", error);
        throw new Error("Failed to delete application");
    }
}

