"use client";

import { useState } from "react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Filter } from "lucide-react";

const enumOptions = {
    jobType: ["DEVELOPER", "TESTER", "DESIGNER", "MANAGER"],
    employmentType: ["CONTRACT_OF_WORK", "B2B", "CONTRACT_OF_MANDATE"],
    workingType: ["REMOTE", "OFFICE", "HYBRID"],
    experienceLevel: ["JUNIOR", "MID", "SENIOR"],
    skill: ["JAVASCRIPT", "TYPESCRIPT", "PYTHON", "JAVA", "REACT", "NODE", "GIT"],
};

const labels: Record<string, Record<string, string>> = {
    jobType: {
        DEVELOPER: "Developer",
        TESTER: "Tester",
        DESIGNER: "Designer",
        MANAGER: "Manager",
    },
    employmentType: {
        CONTRACT_OF_WORK: "Contract of Work",
        B2B: "B2B",
        CONTRACT_OF_MANDATE: "Mandate",
    },
    workingType: {
        REMOTE: "Remote",
        OFFICE: "Office",
        HYBRID: "Hybrid",
    },
    experienceLevel: {
        JUNIOR: "Junior",
        MID: "Mid",
        SENIOR: "Senior",
    },
    skill: {
        JAVASCRIPT: "JavaScript",
        TYPESCRIPT: "TypeScript",
        PYTHON: "Python",
        JAVA: "Java",
        REACT: "React",
        NODE: "Node",
        GIT: "Git",
    },
};

export const JobFilters = ({ filters, onChange }) => {
    const [localFilters, setLocalFilters] = useState({
        ...filters,
        title: filters.title || "",
        jobType: filters.jobType || [],
        employmentType: filters.employmentType || [],
        workingType: filters.workingType || [],
        experienceLevel: filters.experienceLevel || [],
        skill: filters.skill || [],
    });

    const handleCheckboxChange = (category: string, value: string) => {
        const current = localFilters[category] || [];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        setLocalFilters({ ...localFilters, [category]: updated });
    };

    const handleRemoveTag = (category: string, value: string) => {
        const updated = localFilters[category].filter((v: string) => v !== value);
        const nextFilters = { ...localFilters, [category]: updated };
        setLocalFilters(nextFilters);
        onChange(nextFilters);
    };

    const applyFilters = () => {
        onChange(localFilters);
    };

    const clearAll = () => {
        const cleared = {
            title: "",
            jobType: [],
            employmentType: [],
            workingType: [],
            experienceLevel: [],
            skill: [],
        };
        setLocalFilters(cleared);
        onChange(cleared);
    };

    const hasActiveFilters = Object.values(localFilters).some(
        (v) => Array.isArray(v) && v.length > 0
    );

    return (
        <div className="w-full space-y-4 px-4">
            {/* Filter Bar */}
            <div className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between backdrop-blur-sm shadow-sm">
                {/* Left section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <Input
                        placeholder="🔍 Пошук за назвою"
                        value={localFilters.title}
                        onChange={(e) =>
                            setLocalFilters({ ...localFilters, title: e.target.value })
                        }
                        className="flex-1 bg-zinc-800 text-white border-zinc-600 placeholder:text-zinc-400 min-w-[200px]"
                    />

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="bg-white text-zinc-800 hover:bg-zinc-100"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Фільтри
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-[320px] bg-white text-black">
                            <SheetHeader>
                                <SheetTitle>Фільтрувати вакансії</SheetTitle>
                            </SheetHeader>

                            <div className="py-4 space-y-4">
                                <ScrollArea className="h-[60vh] pr-2">
                                    {Object.entries(enumOptions).map(([key, values]) => (
                                        <div key={key} className="mb-4">
                                            <h4 className="text-sm font-semibold uppercase mb-2 tracking-wide text-zinc-600">
                                                {key.replace(/([A-Z])/g, " $1")}
                                            </h4>
                                            <div className="space-y-1">
                                                {values.map((val) => (
                                                    <div key={val} className="flex items-center gap-3 py-1">
                                                        <Checkbox
                                                            id={`${key}-${val}`}
                                                            checked={localFilters[key]?.includes(val)}
                                                            onCheckedChange={() =>
                                                                handleCheckboxChange(key, val)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`${key}-${val}`}
                                                            className="text-sm cursor-pointer"
                                                        >
                                                            {labels[key][val]}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </div>

                            <SheetFooter className="pt-4 flex flex-col gap-2">
                                <Button
                                    onClick={applyFilters}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Застосувати
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        className="text-red-500"
                                        onClick={clearAll}
                                    >
                                        Очистити всі
                                    </Button>
                                )}
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Right: Apply */}
                <div className="w-full sm:w-auto flex justify-start sm:justify-end">
                    <Button
                        onClick={applyFilters}
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                    >
                        Застосувати фільтри
                    </Button>
                </div>
            </div>

            {/* Tags below */}
            <div className="flex flex-wrap gap-2 mt-1">
                {Object.entries(localFilters).flatMap(([key, values]) => {
                    if (Array.isArray(values)) {
                        return values.map((val) => (
                            <span
                                key={`${key}-${val}`}
                                className="flex items-center bg-green-600 text-white rounded-full px-3 py-1 text-sm"
                            >
                                {labels[key][val]}
                                <button
                                    onClick={() => handleRemoveTag(key, val)}
                                    className="ml-1 text-white hover:text-red-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </span>
                        ));
                    }
                    return [];
                })}
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="text-sm text-red-500 underline hover:text-red-600"
                    >
                        Очистити всі
                    </button>
                )}
            </div>
        </div>
    );
};
