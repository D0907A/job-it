"use server"

import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {CompanySchema} from "@/schemas";
import {z} from "zod";

export const createCompany = async (company) => {
    const user = await currentUser();

    if (!user || !user.id) {
        throw new Error("User not authenticated");
    }

    const newCompany = await db.company.create({
        data: {
            name: company.name,
            description: company.description,
            imageUrl: company.imageUrl,
            ownerId: user.id,
        },
    });

    return {data: newCompany,success: "Company created successfully"};
};


export const getCompanyById = async (companyId: string) => {
    const company = await db.company.findUnique({
        where: { id: companyId },
    });

    if (!company) {
        return {error:"Company not found"};
    }

    return company;
};


export const getUserCompany = async () => {
    const user = await currentUser();

    if (!user || !user.id) {
        throw new Error("User not authenticated");
    }

    const companies = await db.company.findMany({
        where: {
            ownerId: user.id
        }
    })

    console.log(companies)

    return companies

}


export const updateCompany = async (
    values: z.infer<typeof CompanySchema>
) => {
    const { id, name, description, imageUrl } = values;

    const user = await currentUser();

    if (!await checkOwnerOfTheCompany(values.id, user?.id))
        return {error: "You do not have enough rights to update this company!"}

    console.log("Passed")

    try {
        const updatedCompany = await db.company.update({
            where: { id },
            data: {
                name,
                description: description ?? null,
                imageUrl: imageUrl ?? null,
            },
        });

        return {data: updatedCompany, success: "Company data updated succesfully"};
    } catch (error) {
        return {error: "Something went wrong!"}
    }
};


export const deleteCompany = async (companyId: string) => {
    const user = await currentUser();

    //just for testing
    //await _new Promise((resolve) => setTimeout(resolve, 2000));

    await db.company.delete({
        where:{
            id: companyId,
            ownerId: user?.id
        }
    })
}

export const checkOwnerOfTheCompany = async (companyId: string, userId: string): Promise<boolean> => {

    //TODO: get userId from the server component
    const company = await db.company.findUnique({
        where: { id: companyId },
        select: { ownerId: true },
    });

    if (!company) return false;

    return company.ownerId === userId;
};