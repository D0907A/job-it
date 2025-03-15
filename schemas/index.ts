import * as z from "zod";
import {UserRole} from "@prisma/client";
import {date} from "zod";

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
    message: "Both password and new password are required together.",
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