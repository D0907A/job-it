import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "@/routes";

const auth = NextAuth(authConfig).auth;

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isEdgeStoreRoute = nextUrl.pathname.startsWith("/api/edgestore");
    const isPublicRoute = publicRoutes.some(prefix =>
        nextUrl.pathname.startsWith(prefix)
    );
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute || isEdgeStoreRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl.origin));
        }
        return null;
    }

    if(!isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL("/auth/login", nextUrl))
    }

    return null;
});



// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
