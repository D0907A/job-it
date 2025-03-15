"use server"

import {LoginSchema} from "@/schemas";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {error} from "next/dist/build/output/log";
import {AuthError} from "next-auth";
import {getUserByEmail} from "@/data/user";
import {generateTwoFactorToken, generateVerificationToken} from "@/lib/tokens";
import {use} from "react";
import {sendTwoFactorTokenEmail, sendVerificationEmail} from "@/lib/mail";
import {getTwoFactorTokenByEmail} from "@/data/two-factor-token";
import {db} from "@/lib/db";
import {getTwoFactorConfirmationByUserId} from "@/data/two-factor-confirmation";

export const login = async (values: any) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }

    const {email, password, code} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Email does not exist"}
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return {success: "Confirmation email sent"}
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );

            if(!twoFactorToken){
                return {error: "Invalid code! 1"};
            }
            if (twoFactorToken.token !== code){
                return {error: `Invalid code! entered: ${twoFactorToken} should be: ${code}`}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired){
                return {error: "Code expired!"}
            }

            await db.twoFactorToken.delete({
                where: {id: twoFactorToken.id}
            })

            const existingCOnfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id
            )

            if(existingCOnfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {id: existingCOnfirmation.id}
                });
            }

            await db.twoFactorConfirmation.create({
                data:{
                    userId: existingUser.id
                }
            })

        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )

            console.log("sent")

            return {twoFactor: true}
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {error: "Invalid credentials"}
                default:
                    return {error: "Something went wrong"}
            }
        }
        throw error;
    }
}