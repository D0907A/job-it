import { ReactNode } from "react";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

interface CompaniesLayoutProps {
    children: ReactNode;
}

const CompaniesLayout = ({ children }: CompaniesLayoutProps) => {
    return (
        <RoleGate allowedRoles={[UserRole.ADMIN, UserRole.EMPLOYER, UserRole.RECRUITER]}>
            {children}
        </RoleGate>
    );
};

export default CompaniesLayout;
