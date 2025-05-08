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
    type: string; // Optional: could be "" | "TECH" | "FINANCE" | "HEALTH"
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
        // Optionally: use router.push() to apply URL filters
    };

    const onClear = () => {
        form.reset({
            search: "",
            status: "ALL",
            type: "",
        });
        // Optionally: clear URL filters here
    };

    return (
        <Card className="sticky top-20 w-full shadow-md">
            <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Фільтри</h2>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Search Input */}
                        <FormField
                            control={form.control}
                            name="search"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Назва компанії</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Пошук…"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status Dropdown */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Статус</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Усі" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">Усі</SelectItem>
                                                <SelectItem value="ACTIVE">Активна</SelectItem>
                                                <SelectItem value="INACTIVE">Неактивна</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Optional: Add Company Type Filter
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Тип</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Всі типи" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Всі типи</SelectItem>
                                                <SelectItem value="TECH">Tech</SelectItem>
                                                <SelectItem value="FINANCE">Finance</SelectItem>
                                                <SelectItem value="HEALTH">Health</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        */}

                        <CardFooter className="flex justify-between p-0 pt-2">
                            <Button variant="outline" type="button" size="sm" onClick={onClear}>
                                Очистити
                            </Button>
                            <Button type="submit" size="sm">
                                Застосувати
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
