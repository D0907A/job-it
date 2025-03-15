import GitHub from "next-auth/providers/github"

import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import {LoginSchema} from "@/schemas";
import {verifyRootLayout} from "next/dist/lib/verify-root-layout";
import {getUserByEmail, getUserById} from "@/data/user";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";

export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", required: true },
                password: { label: "Password", type: "password", required: true },
            },
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (!validatedFields.success) {
                    console.error("Validation failed", validatedFields.error);
                    return null;
                }

                const { email, password } = validatedFields.data;
                const user = await getUserByEmail(email);

                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {
                    return user;
                }

                return null;
            }
        })
    ],
} satisfies NextAuthConfig;
