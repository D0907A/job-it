"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { $Enums, EmploymentType, JobType, WorkingType } from "@prisma/client"
import ExperienceLevel = $Enums.ExperienceLevel

async function isJobOwnedByUser(jobId: string, userId: string) {
    const job = await db.jobVacancy.findUnique({
        where: { id: jobId },
        select: { authorId: true },
    })

    return job?.authorId === userId
}

export async function getJobsByUserId() {
    const user = await currentUser()
    if (!user?.id) return { error: "User not authenticated" }

    try {
        return await db.jobVacancy.findMany({
            where: { authorId: user.id },
            orderBy: { title: "asc" },
        })
    } catch (error) {
        console.error("[GET_USER_JOBS_ERROR]", error)
        throw new Error("Failed to fetch user jobs")
    }
}

export async function getAllPublicJobs(offset = 0, limit = 5, filters: Record<string, string[]> = {}) {
    try {
        const whereClause: Record<string, any> = {
            isActive: true,
        };

        for (const [key, values] of Object.entries(filters)) {
            if (Array.isArray(values) && values.length > 0) {
                if (key === 'title') {
                    whereClause['title'] = {
                        contains: values[0],
                        mode: 'insensitive',
                    };
                } else {
                    whereClause[key] = { in: values };
                }
            }
        }

        return await db.jobVacancy.findMany({
            where: whereClause,
            orderBy: { validUntil: "desc" },
            include: {
                company: true,
                jobSkills: true,
            },
            skip: offset,
            take: limit,
        });
    } catch (error) {
        console.error("[GET_PUBLIC_JOBS_ERROR]", error);
        throw new Error("Failed to fetch public job listings");
    }
}


export async function getJobs(offset = 0, limit = 5, filters = {}) {
    const where = {};



    if (filters.title) {
        where.title = {
            contains: filters.title,
            mode: "insensitive",
        };
    }

    if (filters.jobType?.length) {
        where.jobType = {
            in: filters.jobType,
        };
    }

    if (filters.employmentType?.length) {
        where.employmentType = {
            in: filters.employmentType,
        };
    }

    if (filters.workingType?.length) {
        where.workingType = {
            in: filters.workingType,
        };
    }

    if (filters.experienceLevel?.length) {
        where.experienceLevel = {
            in: filters.experienceLevel,
        };
    }

    if (filters.skill?.length) {
        where.jobSkills = {
            some: {
                skill: {
                    in: filters.skill,
                },
            },
        };
    }

    const jobs = await db.jobVacancy.findMany({
        where,
        include: {
            company: true,
            jobSkills: true,
        },
        skip: offset,
        take: limit,
    });

    return jobs;
}


export async function createJob(formData: FormData) {
    const user = await currentUser()
    if (!user?.id) throw new Error("User not authenticated")

    const {
        title,
        description,
        companyId,
        jobType,
        experienceLevel,
        employmentType,
        workingType,
        paymentFrom,
        paymentTo,
        validUntil,
        skills,
        isActive,
    } = extractJobData(formData)

    try {
        const job = await db.jobVacancy.create({
            data: {
                title,
                description,
                isActive,
                author: { connect: { id: user.id } },
                company: { connect: { id: companyId } },
                jobType,
                experienceLevel,
                employmentType,
                workingType,
                paymentFrom,
                paymentTo,
                validUntil,
                jobSkills: {
                    create: skills.map((skill) => ({ skill })),
                },
            },
            include: { jobSkills: true },
        })

        revalidatePath("/jobs")
        return job
    } catch (error) {
        console.error("[CREATE_JOB_ERROR]", error)
        throw new Error("Failed to create job")
    }
}

export async function updateJob(jobId: string, formData: FormData) {
    const user = await currentUser()
    if (!user?.id) throw new Error("User not authenticated")

    const {
        title,
        description,
        companyId,
        jobType,
        experienceLevel,
        employmentType,
        workingType,
        paymentFrom,
        paymentTo,
        validUntil,
        skills,
        isActive,
    } = extractJobData(formData)

    const isOwner = await isJobOwnedByUser(jobId, user.id)
    if (!isOwner) throw new Error("Not authorized to edit this job")

    console.log("[UPDATE_JOB_DATA]", experienceLevel)

    try {
        await db.jobVacancy.update({
            where: { id: jobId },
            data: {
                title,
                description,
                company: { connect: { id: companyId } },
                jobType,
                experienceLevel,
                employmentType,
                workingType,
                paymentFrom,
                paymentTo,
                validUntil,
                isActive,
                jobSkills: {
                    deleteMany: {},
                    ...(skills.length > 0 && {
                        create: skills.map((skill) => ({ skill })),
                    }),
                },
            },
        })

        revalidatePath("/jobs")
    } catch (error) {
        console.error("[UPDATE_JOB_ERROR]", error)
        throw new Error("Failed to update job")
    }
}

export async function deleteJob(jobId: string) {
    const user = await currentUser()
    if (!user?.id) throw new Error("User not authenticated")

    const isOwner = await isJobOwnedByUser(jobId, user.id)
    if (!isOwner) throw new Error("Not authorized to delete this job")

    try {
        await db.jobVacancy.delete({ where: { id: jobId } })
        revalidatePath("/jobs")
        return { success: true }
    } catch (error) {
        console.error("[DELETE_JOB_ERROR]", error)
        throw new Error("Failed to delete job")
    }
}

export async function getJobById(jobId: string) {
    const user = await currentUser()
    if (!user?.id) throw new Error("User not authenticated")

    const job = await db.jobVacancy.findUnique({
        where: { id: jobId },
        include: {
            company: true,
            jobSkills: true,
        },
    })

    if (!job || job.authorId !== user.id) {
        throw new Error("Not authorized to access this job")
    }

    return job
}

export async function duplicateJob(jobId: string) {
    const user = await currentUser()
    if (!user?.id) throw new Error("User not authenticated")

    const job = await db.jobVacancy.findUnique({
        where: { id: jobId },
        include: { jobSkills: true },
    })

    if (!job || job.authorId !== user.id) {
        throw new Error("Not authorized to duplicate this job")
    }

    try {
        const duplicatedJob = await db.jobVacancy.create({
            data: {
                title: `${job.title} (Copy)`,
                description: job.description,
                isActive: false,
                author: { connect: { id: user.id } },
                company: { connect: { id: job.companyId } },
                jobType: job.jobType,
                experienceLevel: job.experienceLevel,
                employmentType: job.employmentType,
                workingType: job.workingType,
                paymentFrom: job.paymentFrom,
                paymentTo: job.paymentTo,
                validUntil: job.validUntil,
                jobSkills: {
                    create: job.jobSkills.map((s) => ({ skill: s.skill })),
                },
            },
        })

        revalidatePath("/jobs")
        return duplicatedJob
    } catch (error) {
        console.error("[DUPLICATE_JOB_ERROR]", error)
        throw new Error("Failed to duplicate job")
    }
}

function extractJobData(formData: FormData) {
    const title = formData.get("title")?.toString().trim()
    const description = formData.get("description")?.toString().trim()
    const companyId = formData.get("companyId")?.toString()
    const jobType = formData.get("jobType") as JobType
    const employmentType = formData.get("employmentType") as EmploymentType
    const workingType = formData.get("workingType") as WorkingType
    const experienceLevel = formData.get("experienceLevel")?.toString() as ExperienceLevel

    const isActiveRaw = formData.get("isActive")
    const isActive =
        isActiveRaw === "true" || isActiveRaw === "on"
            ? true
            : isActiveRaw === null
                ? true
                : false

    if (!title || !description || !companyId || !jobType || !employmentType || !workingType) {
        throw new Error("Missing required fields")
    }

    const paymentFrom = parseFloat(formData.get("paymentFrom")?.toString() || "0")
    const paymentTo = parseFloat(formData.get("paymentTo")?.toString() || "0")

    const validUntilRaw = formData.get("validUntil")?.toString()
    const validUntil = validUntilRaw ? new Date(validUntilRaw) : null
    if (!validUntil || isNaN(validUntil.getTime())) {
        throw new Error("Valid until date is invalid")
    }

    const skillsRaw = formData.get("skills")?.toString() || ""
    const skills = skillsRaw
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)

    return {
        title,
        description,
        isActive,
        companyId,
        jobType,
        experienceLevel,
        employmentType,
        workingType,
        paymentFrom,
        paymentTo,
        validUntil,
        skills,
    }
}
