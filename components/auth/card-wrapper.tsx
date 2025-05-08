"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
import Link from "next/link";
import { Button } from "../ui/button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
                                children,
                                headerLabel,
                                backButtonLabel,
                                backButtonHref,
                                showSocial,
                            }: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-lg border border-gray-200 rounded-xl">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>

            <CardContent className="space-y-4">
                {children}
            </CardContent>

            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}

            <CardFooter className="flex flex-col gap-3 items-center">
                <BackButton label={backButtonLabel} href={backButtonHref} />

                <Link href="/portal/jobs" className="w-full">
                    <Button
                        variant="outline"
                        className="w-full text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Browse jobs without an account
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};
