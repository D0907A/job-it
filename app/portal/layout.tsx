"use client"

import { Navbar } from "@/app/portal/_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">


            <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
                <Navbar />
                {children}
            </main>
        </div>
    );
};

export default ProtectedLayout;
