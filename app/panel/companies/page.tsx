"use server"

import { currentUser } from "@/lib/auth";
import { getUserCompany } from "@/actions/company";
import CompanyList from "@/app/admin/_components/companyList";
import { FiltersPanel } from "@/app/panel/_components/filters-panel";

const CompanyPage = async () => {
    const user = await currentUser();
    const userCompanies = await getUserCompany();

    return (
        <div className="flex flex-col gap-6 px-4 md:flex-row md:items-start md:justify-center md:gap-8">
            {/* Filters go above the list on mobile, and to the left on desktop */}
            <div className="w-full md:w-2/3">
                <CompanyList userCompanies={userCompanies} />
            </div>

            <div className="w-full md:w-1/3">
                <FiltersPanel />
            </div>
        </div>
    );
};

export default CompanyPage;
