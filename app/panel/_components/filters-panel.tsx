"use client";

import { useForm } from "react-hook-form";

import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface FilterValues {
    search: string;
    status: "ALL" | "ACTIVE" | "INACTIVE";
    type: string; // will be "" | "TECH" | "FINANCE" | "HEALTH"
}

export function FiltersPanel() {
    const form = useForm<FilterValues>({
        defaultValues: {
            search: "",
            status: "ALL",
            type: "",
        },
    });

    const onSubmit = (values: FilterValues) => {
        console.log("apply filters", values);
        // e.g. router.push({ query: { ...values, type: values.type || undefined } })
    };

    const onClear = () => {
        form.reset({
            search: "",
            status: "ALL",
            type: "",
        });
        // clear your query params if needed
    };

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <h3 className="text-lg font-semibold">Filters</h3>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Search */}
                        <FormField
                            control={form.control}
                            name="search"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Search…"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All</SelectItem>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onClear}
                            >
                                Clear
                            </Button>
                            <Button type="submit" size="sm">
                                Apply
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
