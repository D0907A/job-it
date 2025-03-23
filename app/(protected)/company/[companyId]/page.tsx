"use server"

import {checkOwnerOfTheCompany, getCompanyById} from "@/actions/company";
import {currentUser} from "@/lib/auth";
import {redirect, notFound} from "next/navigation";
import CompanyForm from "@/components/company-settings";
import {Company} from ".prisma/client";

interface CompanyPageProps {
    params: { companyId: string };
}

const CompanyPage = async ({params}: CompanyPageProps) => {
    const user = await currentUser();
    if (!user) return notFound();

    const {companyId} = await params;


    //todo: fix types error using interface
    if (companyId=="new"){
        return (
            <CompanyForm company={{id:"new"}}/>
        )
    }else{
        const isOwner = await checkOwnerOfTheCompany(companyId, user.id);
        if (!isOwner) return redirect("/forbidden");

        const company = await getCompanyById(companyId);


        return (
            <CompanyForm company={company}/>
        )
    }
};

export default CompanyPage;


