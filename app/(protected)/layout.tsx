import {Navbar} from "@/app/(protected)/_components/navbar";

interface ProtectedLayoutProps{
    children: React.ReactNode;
}

const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <div className="flex justify-center py-4">
                <Navbar/>
            </div>
            <div className="flex-1 w-full px-4">
                {children}
            </div>
        </div>
    );
}

export default ProtectedLayout;