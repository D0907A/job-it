"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createJobApplication } from "@/actions/application";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import {JobApplicationSchema} from "@/schemas";


type JobApplicationFormData = z.infer<typeof JobApplicationSchema>;

export default function JobsApplicationPanel({ jobAuthorId }: { jobAuthorId: string }) {
    const searchParams = useSearchParams();
    const jobVacancyId = searchParams.get("job") || "";
    const router = useRouter();
    const { edgestore } = useEdgeStore();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<JobApplicationFormData>({
        resolver: zodResolver(JobApplicationSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            coverLetter: "",
            resumeUrl: "",
            jobVacancyId,
        },
    });

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setSubmitted(false);
    }, [jobVacancyId]);

    // Handle file selection.
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // onSubmit handler – if a file is selected and not yet uploaded, upload it first.
    const onSubmit = async (data: JobApplicationFormData) => {
        startTransition(async () => {
            // If file is selected and resumeUrl not set, upload file.
            let submissionData = data;
            if (file && !data.resumeUrl) {
                try {
                    const res = await edgestore.myProtectedFiles.upload({
                        file,
                        onProgressChange: (prog) => setProgress(prog),
                        input: { ownerId: jobAuthorId },
                    });

                    submissionData = { ...data, resumeUrl: res.url };
                    setValue("resumeUrl", res.url);
                } catch (uploadError) {
                    console.error("File upload failed:", uploadError);
                    return;
                }
            }

            // Submit the form data along with the jobVacancyId.
            try {
                const result = await createJobApplication(submissionData);
                console.log("Job Application saved", result);
                setSubmitted(true);
                reset();
                setFile(null);
                setProgress(0);
                // Optionally, navigate away:
                // router.push("/jobs");
            } catch (error) {
                console.error("Error saving application:", error);
            }
        });
    };

    return (
        <div className="space-y-6 p-6 bg-white text-gray-900 rounded-2xl shadow-lg border border-slate-200">
            {/* Header Section */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Відгукнутись</h2>
                <p className="text-sm text-slate-600">
                    Заповніть форму нижче, щоб подати свій відгук на вакансію.
                </p>
            </div>

            <AnimatePresence>
                {!submitted ? (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Ім&apos;я та Прізвище
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                placeholder="Ваші ім'я та прізвище"
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                {...register("fullName")}
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Електронна пошта
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Телефон
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                placeholder="+38 (XXX) XXX-XX-XX"
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                                Супровідний лист
                            </label>
                            <textarea
                                id="coverLetter"
                                placeholder="Напишіть короткий супровідний лист..."
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                {...register("coverLetter")}
                            />
                            {errors.coverLetter && (
                                <p className="mt-1 text-xs text-red-500">{errors.coverLetter.message}</p>
                            )}
                        </div>

                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Додати резюме (файл)
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mt-1 block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                accept=".pdf,.doc,.docx,.png"
                            />
                        </div>

                        {/* Progress Bar */}
                        {progress > 0 && (
                            <div className="h-[6px] w-full rounded bg-gray-500">
                                <div
                                    className="h-full bg-green-400 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}

                        {errors.resumeUrl && (
                            <p className="text-xs text-red-500">{errors.resumeUrl.message}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full rounded-md bg-green-600 py-3 px-4 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            >
                                Відправити відгук
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center space-y-4"
                    >
                        <h2 className="text-3xl font-bold text-green-600">Дякуємо!</h2>
                        <p className="text-lg text-gray-800">
                            Ваш відгук на вакансію було успішно надіслано.
                        </p>
                        <Link
                            href="/jobs"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                            Повернутись до вакансій
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
