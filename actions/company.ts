"use server"

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const createCompany = async (company) => {
    const user = await currentUser();

    if (!user || !user.id) {
        throw new Error("User not authenticated");
    }

    console.log("Creating company for user:", user.id);

    await db.company.create({
        data: {
            name: company.name,
            description: company.description,
            ownerId: user.id,
        },
    });

    return {success: "Company created succesfully"};
};
