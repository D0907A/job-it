"use client"

import * as z from "zod"
import {auth, signOut} from "@/auth";
import {useSession} from "next-auth/react";
import {logout} from "@/actions/logout";
import {useCurrentUser} from "@/hooks/use-current-user";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {settings} from "@/actions/settings";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {SettingsSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {date} from "zod";
import {Form, FormField, FormLabel, FormControl, FormDescription, FormMessage, FormItem} from "@/components/ui/form";
import {FormError} from "@/components/form-error";
import {Input} from "@/components/ui/input";
import {FormSuccess} from "@/components/ui/form-success";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UserRole} from "@prisma/client";
import {Switch} from "@/components/ui/switch";
import {createCompany, getUserCompany} from "@/actions/company";

const SettingsPage = () => {
    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);


    const {update} = useSession();
    const [isPending, startTransition] = useTransition();

    // TODO: Fix undefined errors
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name || undefined,
            email: user?.email || undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
        }
    })
    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then((data) => { // <-- Capture the response
                    if (data?.error) {
                        setError(data.error);
                    }

                    if (data?.success) {
                        update();
                        setSuccess(data.success);
                        console.log(success);
                    }
                })
                .catch(() => setError("Something went wrong"));
        });
    };

    const buttonClick = () => {
        createCompany();
        getUserCompany()
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">Settings</p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="John Doe"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {user?.isOAuth == false && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="test@gmail.com"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="*****"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="*****"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isTwoFactorEnabled"
                                        render={({field}) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">

                                                <div className="space-y-0.5">
                                                    <FormLabel>Two Factor Authentification</FormLabel>
                                                    <FormDescription>
                                                        Enable two factor authentification for your account
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        disabled={isPending}
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>

                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <FormField
                                control={form.control}
                                name="role"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>

                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>
                                                    Admin
                                                </SelectItem>
                                                <SelectItem value={UserRole.USER}>
                                                    User
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormError message={error}/>
                            <FormSuccess message={success}/>
                            <Button disabled={isPending} type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
                <Button onClick={buttonClick}>Save company</Button>
            </CardContent>
        </Card>
    );

}

export default SettingsPage;
