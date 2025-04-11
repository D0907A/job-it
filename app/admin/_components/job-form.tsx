"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormSuccess } from "@/components/ui/form-success";
import { FormError } from "@/components/form-error";

import { JobSchema, type JobFormData } from "@/schemas";
import { createJob, updateJob } from "@/actions/jobs";
import { getUserCompany } from "@/actions/company";
import {ExperienceLevel} from "@prisma/client";

interface Job {
    id: string;
    title: string;
    description: string;
    jobType?: string;
    experience?: number;
    experienceLevel?: ExperienceLevel;
    jobLevel?: string;
    employmentType?: string;
    workingType?: string;
    paymentFrom?: number;
    paymentTo?: number;
    validUntil?: string;
    jobSkills?: { skill: string }[];
    companyId?: string;
    isActive?: boolean;
}

interface JobFormProps {
    job?: Job;
}

export default function JobForm({ job }: JobFormProps) {
    const form = useForm<JobFormData>({
        resolver: zodResolver(JobSchema),
        defaultValues: {
            title: job?.title || "",
            description: job?.description || "",
            jobType: job?.jobType || "",
            experience: job?.experience ?? undefined,
            jobLevel: job?.jobLevel || "",
            experienceLevel: job?.experienceLevel || "",
            employmentType: job?.employmentType || "",
            workingType: job?.workingType || "",
            paymentFrom: job?.paymentFrom ?? 0,
            paymentTo: job?.paymentTo ?? 0,
            validUntil: job?.validUntil ? new Date(job.validUntil).toISOString().slice(0, 10) : "",
            skills: job?.jobSkills?.map((s) => s.skill).join(", ") || "",
            companyId: job?.companyId || "",
            isActive: job?.isActive ?? true,
        },
    });

    const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<string>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const fetchCompanies = async () => {
            const companiesList = await getUserCompany();
            setCompanies(companiesList);
        };
        fetchCompanies();
    }, []);

    const onSubmit = (data: JobFormData) => {
        startTransition(async () => {
            setError(undefined);
            setSuccess(undefined);


            try {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (typeof value === "boolean") {
                        formData.append(key, value ? "true" : "false");
                    } else {
                        formData.append(key, String(value));
                    }
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

    const SelectField = ({
                             name,
                             label,
                             options,
                         }: {
        name: keyof JobFormData;
        label: string;
        options: { label: string; value: string }[];
    }) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <select {...field} className="w-full p-2 border rounded" disabled={isPending}>
                            <option value="">Select {label.toLowerCase()}</option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

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
                                <FormItem className="flex items-center justify-between border p-3 rounded shadow-sm">
                                    <FormLabel>Active</FormLabel>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                                        <Textarea rows={4} {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SelectField
                            name="jobType"
                            label="Job Type"
                            options={[
                                { value: "DEVELOPER", label: "Developer" },
                                { value: "TESTER", label: "Tester" },
                                { value: "DESIGNER", label: "Designer" },
                                { value: "MANAGER", label: "Manager" },
                            ]}
                        />

                        {/*<FormField*/}
                        {/*    control={form.control}*/}
                        {/*    name="experience"*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <FormItem>*/}
                        {/*            <FormLabel>Experience (years)</FormLabel>*/}
                        {/*            <FormControl>*/}
                        {/*                <Input type="number" {...field} disabled={isPending} />*/}
                        {/*            </FormControl>*/}
                        {/*            <FormMessage />*/}
                        {/*        </FormItem>*/}
                        {/*    )}*/}
                        {/*/>*/}

                        {/*<SelectField*/}
                        {/*    name="jobLevel"*/}
                        {/*    label="Job Level"*/}
                        {/*    options={[*/}
                        {/*        { value: "TRAINEE", label: "Trainee" },*/}
                        {/*        { value: "JUNIOR", label: "Junior" },*/}
                        {/*        { value: "MID", label: "Mid" },*/}
                        {/*        { value: "SENIOR", label: "Senior" },*/}
                        {/*    ]}*/}
                        {/*/>*/}

                        <SelectField
                            name="experienceLevel"
                            label="Experience Level"
                            options={[
                                { value: "JUNIOR", label: "Junior" },
                                { value: "MID", label: "Mid" },
                                { value: "SENIOR", label: "Senior" },
                            ]}
                        />

                        <SelectField
                            name="employmentType"
                            label="Employment Type"
                            options={[
                                { value: "CONTRACT_OF_WORK", label: "Contract of Work" },
                                { value: "B2B", label: "B2B" },
                                { value: "CONTRACT_OF_MANDATE", label: "Contract of Mandate" },
                            ]}
                        />

                        <SelectField
                            name="workingType"
                            label="Working Type"
                            options={[
                                { value: "REMOTE", label: "Remote" },
                                { value: "OFFICE", label: "Office" },
                                { value: "HYBRID", label: "Hybrid" },
                            ]}
                        />

                        <div className="flex gap-4">
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

                        <SelectField
                            name="companyId"
                            label="Company"
                            options={companies.map((c) => ({ label: c.name, value: c.id }))}
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
