"use server";

import {RegisterSchema} from "@/schemas";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs";
import {getUserByEmail} from "@/data/user";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";

export const register = async (values: unknown) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }

    // Extracting values from validatedFields.data (not validatedFields directly)
    const {email, password, name} = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    console.log("Found")
    console.log(existingUser)

    if (existingUser) {
        return {error: "Email already in use"};
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const verificationToken
        = await generateVerificationToken(email)

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )

    return {success: "Confirmation email sent"};
};
