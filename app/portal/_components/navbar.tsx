"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-sm">
            <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left Section: Logo / Brand Name */}
                <div className="flex items-center">
                    {/* Replace the text with your logo or brand graphic */}
                    <Link
                        href="/"
                        className="text-2xl font-extrabold tracking-wider text-white"
                    >
                        MyJobBoard
                    </Link>
                </div>

                {/* Right Section: Desktop Menu */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-white/90 hover:text-white font-medium transition"
                    >
                        Головна
                    </Link>
                    <Link
                        href="/jobs"
                        className="text-white/90 hover:text-white font-medium transition"
                    >
                        Вакансії
                    </Link>
                    <Link
                        href="/companies"
                        className="text-white/90 hover:text-white font-medium transition"
                    >
                        Компанії
                    </Link>
                    <Link
                        href="/contact"
                        className="text-white/90 hover:text-white font-medium transition"
                    >
                        Контакти
                    </Link>
                </nav>

                {/* Hamburger Icon (mobile) */}
                <button
                    type="button"
                    className="md:hidden text-white/90 hover:text-white transition"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Mobile Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/10 border-t border-white/20 backdrop-blur-sm shadow-sm">
                    <nav className="px-4 py-3 space-y-2">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-white/90 hover:text-white font-medium transition"
                        >
                            Головна
                        </Link>
                        <Link
                            href="/jobs"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-white/90 hover:text-white font-medium transition"
                        >
                            Вакансії
                        </Link>
                        <Link
                            href="/companies"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-white/90 hover:text-white font-medium transition"
                        >
                            Компанії
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-white/90 hover:text-white font-medium transition"
                        >
                            Контакти
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
