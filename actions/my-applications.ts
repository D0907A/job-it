import {currentUser} from "@/lib/auth";
import { db } from "@/lib/db";


export async function getMyApplications() {
    const user = await currentUser();

    const myApplications = await db.jobApplication.findMany({
        where: {
            userId: user.id
        },
        include: {
            jobVacancy: true,
        },
    })

    return myApplications;
}