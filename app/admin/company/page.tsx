"use server"

import { currentUser } from "@/lib/auth";
import {deleteCompany, getUserCompany} from "@/actions/company";
import CompanyForm from "@/components/company-settings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Link from "next/link";
import CompanyList from "@/app/admin/_components/companyList";

const CompanyPage = async () => {
    const user = await currentUser();
    const userCompanies = await getUserCompany();


    return (
        <CompanyList userCompanies={userCompanies}/>
    );
};

export default CompanyPage;
