import * as z from "zod";
import {UserRole, JobType, JobSkill, EmploymentType, WorkingType, ExperienceLevel} from "@prisma/client";
import {date} from "zod";

export const JobApplicationSchema = z.object({
    fullName: z.string().min(1, "Ім'я є обов’язковим"),
    email: z.string().email("Некоректна адреса електронної пошти"),
    phone: z.string().optional(),
    coverLetter: z.string().min(1, "Супровідний лист не може бути порожнім"),
    resumeUrl: z.string().optional(),
    jobVacancyId: z.string().min(1, "Необхідно вибрати вакансію"),
    userId: z.string().optional(),
});


export const JobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),

    companyId: z.string().min(1, "Company is required"),

    jobType: z.nativeEnum(JobType),
    experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
    employmentType: z.nativeEnum(EmploymentType),
    workingType: z.nativeEnum(WorkingType),

    paymentFrom: z.coerce.number().min(0, "Must be a number"),
    paymentTo: z.coerce.number().min(0, "Must be a number"),

    validUntil: z.coerce.date({
        errorMap: () => ({ message: "Valid until date is required" }),
    }),

    skills: z.string().optional(),
});

type CompanyFormData = z.infer<typeof CompanySchema>;

interface Company {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
}

interface CompanyFormProps {
    company?: Company;
}

export const CompanySchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
});

export const SettingsSchema = z.object({
    name: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    role: z.nativeEnum(UserRole), // Fix: Use nativeEnum instead of manually listing values
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
}).refine((data) => {
    if ((data.password && !data.newPassword) || (!data.password && data.newPassword)) {
        return false;
    }
    return true;
}, {
    message: "Both password and _new password are required together.",
    path: ["newPassword"],
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6,{
        message: "Minimum 6 chars required"
    })
})
export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    })
})

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string())
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Password is required with min 6 chars"
    }),
    name: z.string().min(1, {
        message: "Name is required",
    })
})