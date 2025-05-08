"use server"

import { currentUser } from "@/lib/auth";
import { getUserCompany } from "@/actions/company";
import CompanyList from "@/app/admin/_components/companyList";
import { FiltersPanel } from "@/app/panel/_components/filters-panel";
import {UserRole} from "@prisma/client";
import {FormSuccess} from "@/components/ui/form-success";
import {RoleGate} from "@/components/auth/role-gate";

const CompanyPage = async () => {
    const user = await currentUser();
    const userCompanies = await getUserCompany();

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 h-screen p-6 overflow-hidden">
            {/* Right: Scrollable list */}
            <div className="flex-1 overflow-y-auto pr-2 max-w-4xl">
                    <CompanyList userCompanies={userCompanies} />
            </div>
        </div>
    );
};

export default CompanyPage;
