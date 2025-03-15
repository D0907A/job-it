"use server"

import * as z from "zod"
import {getUserByEmail} from "@/data/user";
import {ResetSchema} from "@/schemas";
import {generatePasswordResetToken} from "@/lib/tokens";
import {sendPasswordResetemail} from "@/lib/mail";
export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email not found!" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    generatePasswordResetToken(email);
    await sendPasswordResetemail(
        passwordResetToken.email,
        passwordResetToken.token
    )
    

    return { success: "Reset email sent!" };
};

