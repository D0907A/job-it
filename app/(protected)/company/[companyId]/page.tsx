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

    const fetchedParams = await params;


    //todo: fix types error using interface
    if (params.companyId=="new"){
        return (
            <CompanyForm company={{id:"new"}}/>
        )
    }else{
        const isOwner = await checkOwnerOfTheCompany(fetchedParams.companyId, user.id);
        if (!isOwner) return redirect("/forbidden");

        const company = await getCompanyById(fetchedParams.companyId);


        return (
            <CompanyForm company={company}/>
        )
    }
};

export default CompanyPage;


