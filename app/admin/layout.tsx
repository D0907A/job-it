import { Navbar } from "@/app/admin/_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-600 text-foreground">
            {/* Navbar Container */}
            <div className="flex justify-center py-4">
                <Navbar />
            </div>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto w-full px-4 pb-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ProtectedLayout;
