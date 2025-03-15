"use server"

import * as z from "zod"
import {SettingsSchema} from "@/schemas";
import {currentUser} from "@/lib/auth";
import {getUserByEmail, getUserById} from "@/data/user";
import {db} from "@/lib/db";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";
import bcrypt from "bcryptjs";
import {update} from "@/auth";

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();

    console.log("RECIEVED VALS")
    console.log(values)

    if (!user) {
        return {error: "Unathorized"}
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser){
        return { error: "Unathorized"}
    }

    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);
        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email is already in use" };
        }

        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verification email sent! Please verify your email before updating your profile." };
    }

    console.log(values)


    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);
        if (!passwordsMatch) {
            return { error: "Incorrect current password" };
        }

        values.password = await bcrypt.hash(values.newPassword, 10);
        values.newPassword = undefined;
    }
    await db.user.update({
        where: {id: dbUser.id},
        data: {
            ...values,
        }
    });


    return { success: "Settings Updated!"}
}
