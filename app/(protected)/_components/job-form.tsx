"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
import {Switch} from "@/components/ui/switch";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/form-error";

import { JobSchema } from "@/schemas";
import { createJob, updateJob } from "@/actions/jobs";
import { getUserCompany } from "@/actions/company";

import type { z } from "zod";
import type { JobFormData } from "@/schemas";

interface JobFormProps {
    job?: any; // consider replacing 'any' with an actual Job type
}

export default function JobForm({ job }: JobFormProps) {
    const form = useForm<z.infer<typeof JobSchema>>({
        resolver: zodResolver(JobSchema),
        defaultValues: {
            title: job?.title || "",
            description: job?.description || "",
            jobType: job?.jobType || undefined,
            employmentType: job?.employmentType || undefined,
            workingType: job?.workingType || undefined,
            paymentFrom: job?.paymentFrom || 0,
            paymentTo: job?.paymentTo || 0,
            validUntil: job?.validUntil ? new Date(job.validUntil).toISOString().slice(0, 10) : "",
            skills: job?.jobSkills?.map((s: any) => s.skill).join(", ") || "",
            companyId: job?.companyId || "",
            isActive: job?.isActive ?? true,
        },
    });

    const [companies, setCompanies] = useState<any[]>([]);
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<string>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        async function fetchCompanies() {
            const companiesList = await getUserCompany();
            setCompanies(companiesList);
        }
        fetchCompanies();
    }, []);

    const onSubmit = (data: z.infer<typeof JobSchema>) => {
        startTransition(async () => {
            setError(undefined);
            setSuccess(undefined);

            try {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    formData.append(key, value as string);
                });

                if (job?.id) {
                    await updateJob(job.id, formData);
                    setSuccess("Job updated successfully");
                } else {
                    await createJob(formData);
                    router.push("/jobs");
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-md flex flex-col">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {job ? "Edit Job" : "Create Job"}
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <FormLabel>Active</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="jobType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded" disabled={isPending}>
                                            <option value="">Select job type</option>
                                            <option value="DEVELOPER">Developer</option>
                                            <option value="TESTER">Tester</option>
                                            <option value="DESIGNER">Designer</option>
                                            <option value="MANAGER">Manager</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="employmentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employment Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded" disabled={isPending}>
                                            <option value="">Select employment type</option>
                                            <option value="CONTRACT_OF_WORK">Contract of Work</option>
                                            <option value="B2B">B2B</option>
                                            <option value="CONTRACT_OF_MANDATE">Contract of Mandate</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="workingType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Working Type</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded" disabled={isPending}>
                                            <option value="">Select working type</option>
                                            <option value="REMOTE">Remote</option>
                                            <option value="OFFICE">Office</option>
                                            <option value="HYBRID">Hybrid</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="paymentFrom"
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Payment From</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentTo"
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>Payment To</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="validUntil"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valid Until</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Skills</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Comma-separated" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="companyId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                        <select {...field} className="w-full p-2 border rounded" disabled={isPending}>
                                            <option value="">Select company</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && <FormError message={error} />}
                        {success && <FormSuccess message={success} />}

                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? "Saving..." : job ? "Update" : "Create"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
