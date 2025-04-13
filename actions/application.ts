"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {JobApplicationSchema} from "@/schemas";

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
