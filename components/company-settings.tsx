"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/form-error";

import {createCompany, updateCompany} from "@/actions/company";
import { CompanySchema } from "@/schemas";
import {redirect, useRouter} from "next/navigation";

type CompanyFormData = z.infer<typeof CompanySchema>;

interface Company {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
}

interface CompanyFormProps {
    company?: Company;
}

export default function CompanyForm({ company }: CompanyFormProps) {

    const form = useForm<CompanyFormData>({
        resolver: zodResolver(CompanySchema),
        defaultValues: {
            name: company?.name,
            description: company?.description | ""
        },
    });

    useEffect(() => {
        if (company) {
            form.reset({
                name: company.name,
                description: company.description ?? "",
            });
        }
    }, [company, form]);

    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<string>();
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const onSubmit = (data: CompanyFormData) => {
        startTransition(async () => {
            setError(undefined);
            setSuccess(undefined);

            try {
                if (company) {
                    if (company.id=="new"){
                        const result = await createCompany(data);
                        if (result.success) {
                            setSuccess(result.success);
                            router.push(`/panel/companies/${result.data.id}`);
                        } else {
                            setError(result.error);
                        }
                    }else{
                        //adding the id of the company
                        data.id = company.id;

                        const result = await updateCompany(data);

                        if (result.success) {
                            setSuccess(result.success);
                        } else {
                            setError(result.error);
                        }
                    }
                } else {
                    await createCompany(data);
                    setError("Something went wrong!");
                    form.reset();
                }
            } catch (err: any) {
                console.error(err);
                setError("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <Card className="w-[600px] mx-auto">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {company ? "Edit Company" : "Create Company"}
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Example Corp"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Describe your company"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {error && <FormError message={error} />}
                            {success && <FormSuccess message={success} />}

                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : company ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
