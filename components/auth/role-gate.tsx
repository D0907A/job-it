"use client"

import { UserRole } from "@prisma/client"
import { useCurrentRole } from "@/hooks/use-current-role"
import { FormError } from "@/components/form-error"

interface RoleGateProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
    silent?: boolean // <- new optional prop
}

export const RoleGate = ({
                             children,
                             allowedRoles,
                             silent = false,
                         }: RoleGateProps) => {
    const role = useCurrentRole()

    if (!role || !allowedRoles.includes(role)) {
        return silent ? null : <FormError message="You do not have permission to view this content!" />
    }

    return <>{children}</>
}
