"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const routes = [
        { href: "/admin/server", label: "Server" },
        { href: "/admin/client", label: "Client" },
        { href: "/admin/settings", label: "Settings" },
        { href: "/admin/company", label: "Company" },
        { href: "/admin/jobs", label: "Jobs" },
    ];

    return (
        <motion.nav
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-white/80 backdrop-blur border border-white/30 shadow-xl rounded-2xl px-6 py-3 md:px-8 md:py-4 flex items-center justify-between w-full max-w-7xl mx-auto mt-6"
        >
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-2">
                        {routes.map((route) => {
                            const isActive = pathname.startsWith(route.href);
                            return (
                                <NavigationMenuItem key={route.href}>
                                    <Button
                                        asChild
                                        variant={isActive ? "default" : "ghost"}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-indigo-600 text-white"
                                                : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        <Link href={route.href}>{route.label}</Link>
                                    </Button>
                                </NavigationMenuItem>
                            );
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="text-slate-600 hover:text-slate-900 transition"
                    aria-label="Toggle Mobile Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 bg-white border border-slate-200 mt-2 mx-4 rounded-xl shadow-lg md:hidden"
                >
                    <nav className="flex flex-col p-4 gap-2">
                        {routes.map((route) => {
                            const isActive = pathname.startsWith(route.href);
                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {route.label}
                                </Link>
                            );
                        })}
                    </nav>
                </motion.div>
            )}

            {/* Right Section: User Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden md:block"
            >
                <UserButton />
            </motion.div>
        </motion.nav>
    );
};
