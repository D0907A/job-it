"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="py-6">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-white tracking-wide">Job-It</h1>
                <nav>
                    <ul className="flex space-x-8">
                        {["Home", "Jobs", "Companies", "Contact"].map((item) => (
                            <li key={item}>
                                <a
                                    href={`/portal/${item.toLowerCase()}`}
                                    className="relative group text-white/80 font-bold transition transform hover:scale-105"
                                >
                                    {item}
                                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-400 transition-all group-hover:w-full"></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
