import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
