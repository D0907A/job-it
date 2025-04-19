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
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const onClickDeleteCompany = async (companyId: string) => {
        setDeletingId(companyId);

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
        <div className="w-full max-w-2xl px-4">
            <Card>
                <CardHeader>
                    <p className="text-2xl font-semibold text-center">Companies</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                        <Link href="companies/new">
                            <Button>Add new</Button>
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border p-3 shadow-sm hover:bg-gray-100 transition"
                            >
                                <Link href={`companies/${company.id}`} className="block flex-1">
                                    <p className="text-sm font-medium">{company.name}</p>
                                    <p className="truncate text-xs font-mono p-1 bg-slate-100 rounded-md max-w-full sm:max-w-[180px]">
                                        {company.description || "No description"}
                                    </p>
                                </Link>

                                <div className="flex justify-end sm:justify-start">
                                    <Button
                                        onClick={() => onClickDeleteCompany(company.id)}
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        disabled={deletingId === company.id}
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyList;
