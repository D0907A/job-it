"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Home", href: "/portal/home" },
        { label: "Jobs", href: "/portal/jobs" },
        { label: "Companies", href: "/portal/companies" },
        { label: "Contact", href: "/portal/contact" },
    ];

    return (
        <header className="py-6 relative z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
                    Job-It
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="relative group text-white/80 font-semibold transition transform hover:scale-105"
                        >
                            {label}
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-400 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}

                    {/* Admin Link with User Icon */}
                    <Link
                        href="/panel/jobs"
                        className="text-white hover:text-green-400 transition"
                        title="Admin Panel"
                    >
                        <User className="w-6 h-6" />
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-6 py-4 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-xl mt-4 mx-4 shadow-lg space-y-4">
                    {navItems.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-white font-medium hover:text-green-400 transition"
                        >
                            {label}
                        </Link>
                    ))}
                    <Link
                        href="/panel/jobs"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-white font-medium hover:text-green-400 transition"
                    >
                        <User className="inline w-5 h-5 mr-1" />
                        Admin Panel
                    </Link>
                </div>
            )}
        </header>
    );
}
