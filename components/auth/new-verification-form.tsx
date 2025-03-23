"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteCompany } from "@/actions/company";
import { BeatLoader } from "react-spinners";

const CompanyList = ({ userCompanies }) => {
    const [companies, setCompanies] = useState(userCompanies);
    const [deletingId, setDeletingId] = useState<string | null>(null); // Track currently deleting company

    const onClickDeleteCompany = async (companyId: string) => {
        setDeletingId(companyId); // Set the loading state

        try {
            await deleteCompany(companyId);
            setCompanies((prev) => prev.filter((c) => c.id !== companyId));
        } catch (error) {
            console.error("Failed to delete company", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">Companies</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm hover:bg-gray-100 transition"
                    >
                        <Link href={`/company/${company.id}`} className="block flex-1">
                            <p className="text-sm font-medium">{company.name}</p>
                            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                                {company.description || "No description"}
                            </p>
                        </Link>
                        <div>
                            <Button
                                onClick={() => onClickDeleteCompany(company.id)}
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-1"
                                disabled={deletingId === company.id} // Disable while deleting
                            >
                                {deletingId === company.id ? (
                                    <BeatLoader size={8} color="white" />
                                ) : (
                                    <>
                                        Delete
                                        <Trash className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default CompanyList;
