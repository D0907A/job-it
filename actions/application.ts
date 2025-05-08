'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { JobApplicationSchema } from '@/schemas';

// Types
type JobApplicationInput = unknown;

export async function createJobApplication(raw: JobApplicationInput) {
    const user = await currentUser();

    // Early return if input is not an object
    if (typeof raw !== 'object' || raw === null) {
        return { error: 'Invalid form data', details: { _: ['Bad input format'] } };
    }

    // Prepare data with userId if logged in
    const data = {
        ...(raw as Record<string, unknown>),
        ...(user && { userId: user.id }),
    };

    const parsed = JobApplicationSchema.safeParse(data);

    if (!parsed.success) {
        return {
            error: 'Invalid form data',
            details: parsed.error.flatten().fieldErrors,
        };
    }

    const {
        fullName,
        email,
        phone,
        coverLetter,
        resumeUrl,
        jobVacancyId,
        userId,
    } = parsed.data;

    try {
        const created = await db.jobApplication.create({
            data: {
                applicantName: fullName,
                email,
                phone,
                coverLetter,
                resumeUrl,
                jobVacancy: { connect: { id: jobVacancyId } },
                ...(userId && { user: { connect: { id: userId } } }),
            },
        });

        return { success: true, data: created };
    } catch (err) {
        console.error('Failed to create application:', err);
        return { error: 'Failed to create application' };
    }
}

export async function fetchApplicationsWithFilters(filters: {
    status?: string;
    name?: string;
}) {
    const user = await currentUser();
    if (!user) return [];

    const where: Record<string, any> = {
        jobVacancy: { authorId: user.id },
    };

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.name) {
        where.applicantName = {
            contains: filters.name,
            mode: 'insensitive',
        };
    }

    return db.jobApplication.findMany({
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
    });
}

export async function getApplicationsForUserJobs(filters?: {
    status?: string;
    name?: string;
}) {
    return fetchApplicationsWithFilters(filters ?? {});
}

export async function updateApplicationStatus(
    applicationId: string,
    status: string
) {
    try {
        return await db.jobApplication.update({
            where: { id: applicationId },
            data: { status },
        });
    } catch (err) {
        console.error('Failed to update status:', err);
        throw new Error('Update failed');
    }
}

export async function deleteApplication(applicationId: string) {
    const user = await currentUser();
    if (!user) throw new Error('Unauthorized');

    const application = await db.jobApplication.findUnique({
        where: { id: applicationId },
        include: { jobVacancy: { select: { authorId: true } } },
    });

    if (!application || application.jobVacancy.authorId !== user.id) {
        throw new Error('Not allowed to delete this application');
    }

    try {
        await db.jobApplication.delete({ where: { id: applicationId } });
        return { success: 'Application deleted successfully' };
    } catch (err) {
        console.error('Failed to delete application:', err);
        throw new Error('Delete failed');
    }
}
