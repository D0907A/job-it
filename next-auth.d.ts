import {DefaultSession} from "next-auth";
import {$Enums} from ".prisma/client";
import UserRole = $Enums.UserRole;

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
};

declare module "next-auth"{
    interface Session{
        user: ExtendedUser
    }
}