'use server';

import * as z from 'zod';
import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { currentUser } from "@/lib/auth";
import {string} from "zod";

type Context = {
    userId: string;
    userRole: "USER" | "ADMIN";
};

async function createContext({ req }: { req: Request }): Promise<Context> {
    const user = await currentUser();

    // console.log("User context:", user.id, user.role);


    return {
        userId: user?.id ?? "guest",
        userRole: user?.role ?? "USER",
    };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
    publicCompanyImages: es.imageBucket(),

    myProtectedFiles: es
        .fileBucket()
        .path(({ input }) => [{ owner: input.ownerId }])
        .input(z.object({ ownerId: z.string() }))
        .accessControl({
            OR: [
                {
                    userId: { path: "owner" },
                },
                {
                    userRole: { eq: "ADMIN" },
                },
            ],
        }),



});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
    createContext,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;
