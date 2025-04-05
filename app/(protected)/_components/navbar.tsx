"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { motion } from "framer-motion";

export const Navbar = () => {
    const pathname = usePathname();

    const routes = [
        { href: "/server", label: "Server" },
        { href: "/client", label: "Client" },
        { href: "/admin", label: "Admin" },
        { href: "/settings", label: "Settings" },
        { href: "/company", label: "Company" },
        { href: "/jobs", label: "Jobs" },
    ];

    return (
        <motion.nav
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-lg border border-white/30 shadow-xl rounded-full px-8 py-4 flex justify-between items-center w-full max-w-6xl mx-auto mt-4"
        >
            <div className="flex flex-wrap gap-2">
                {routes.map((route) => {
                    const isActive = pathname === route.href;

                    return (
                        <motion.div
                            key={route.href}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                asChild
                                variant={isActive ? "default" : "ghost"}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-gray-900 text-white shadow-inner"
                                        : "hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <Link href={route.href}>{route.label}</Link>
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <UserButton />
            </motion.div>
        </motion.nav>
    );
};
