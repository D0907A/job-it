/*
 * JobFilters.tsx – v3
 * Extra‑polished UI / UX tweaks
 * – Live counter badge on the Filters button
 * – Clearable search input
 * – Close icon on active chips (better affordance)
 * – Subtler glass card & hover rings
 * – Tiny accessibility tweaks (Esc closes drawer)
 */
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobFiltersProps {
    filters: Record<string, string[]>;
    onChange: (newFilters: Record<string, string[]>) => void;
}

// ----- static values -----
const JobTypeValues = ['DEVELOPER', 'TESTER', 'DESIGNER', 'MANAGER'];
const JobLevelValues = ['TRAINEE', 'JUNIOR', 'MID', 'SENIOR'];
const EmploymentTypeValues = ['CONTRACT_OF_WORK', 'B2B', 'CONTRACT_OF_MANDATE'];
const WorkingTypeValues = ['REMOTE', 'OFFICE', 'HYBRID'];
const ExperienceLevelValues = ['JUNIOR', 'MID', 'SENIOR'];

const filterOptions = [
    { label: 'Job Type', name: 'jobType', values: JobTypeValues },
    { label: 'Job Level', name: 'jobLevel', values: JobLevelValues },
    { label: 'Employment', name: 'employmentType', values: EmploymentTypeValues },
    { label: 'Working Type', name: 'workingType', values: WorkingTypeValues },
    { label: 'Experience', name: 'experienceLevel', values: ExperienceLevelValues },
];

export const JobFilters = ({ filters, onChange }: JobFiltersProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState('');

    // ----- helpers -----
    const toggleValue = (name: string, value: string) => {
        const current = filters[name] || [];
        const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        onChange({ ...filters, [name]: next });
    };

    const clearAll = () => {
        const cleared: Record<string, string[]> = {};
        filterOptions.forEach(opt => (cleared[opt.name] = []));
        cleared['title'] = [];
        onChange(cleared);
        setSearch('');
    };

    const chips = useMemo(() =>
            Object.entries(filters)
                .flatMap(([key, values]) =>
                    values.map(v => ({ key, value: v.replaceAll('_', ' ').toLowerCase(), raw: v }))
                )
                .filter(({ key }) => key !== 'title'),
        [filters]
    );

    const selectedCount = chips.length;

    // close drawer with Esc (UX)
    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDrawerOpen(false);
        },
        []
    );

    // attach once drawer is open
    useEffect(() => {
        if (drawerOpen) {
            window.addEventListener('keydown', handleKey);
            return () => window.removeEventListener('keydown', handleKey);
        }
    }, [drawerOpen, handleKey]);

    return (
        <div className="w-full max-w-6xl mx-auto rounded-[24px] bg-white/5 backdrop-blur-lg ring-1 ring-white/10 p-8 shadow-xl">
            {/* top row */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
                {/* Filters button / badge */}
                <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <SheetTrigger asChild>
                        <Button
                            size="lg"
                            className="relative flex items-center gap-2 font-semibold bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-3 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-green-400"
                        >
                            <Filter className="w-4 h-4" /> Filters
                            {selectedCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 bg-white text-green-600 ring-1 ring-green-500 shadow-sm">
                                    {selectedCount}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>

                    {/* Drawer */}
                    <SheetContent
                        side="left"
                        className="w-[320px] sm:w-[380px] lg:w-[420px] bg-white rounded-r-3xl px-7 py-10 shadow-2xl border-none"
                    >
                        <SheetHeader className="mb-8">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="text-2xl font-bold text-gray-900">Refine search</SheetTitle>
                                <SheetClose asChild>
                                    <button className="p-1 rounded-full hover:bg-gray-100">
                                        <X className="w-5 h-5 text-gray-700" />
                                    </button>
                                </SheetClose>
                            </div>
                        </SheetHeader>

                        {/* internal search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            {search && (
                                <X
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                                    onClick={() => setSearch('')}
                                />
                            )}
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search option…"
                                className="pl-9 pr-9 bg-gray-100 border-none text-sm focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <ScrollArea className="h-[calc(100vh-300px)] pr-1">
                            <div className="space-y-10 pb-10">
                                {filterOptions.map(({ label, name, values }) => (
                                    <div key={name} className="space-y-4">
                                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {values
                                                .filter(v => (search ? v.toLowerCase().includes(search.toLowerCase()) : true))
                                                .map(value => (
                                                    <label key={value} className="flex items-center gap-2 text-sm text-gray-800">
                                                        <Checkbox
                                                            checked={filters[name]?.includes(value) ?? false}
                                                            onCheckedChange={() => toggleValue(name, value)}
                                                            className="border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                        />
                                                        {value.replaceAll('_', ' ').toLowerCase()}
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* footer */}
                        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/70 -mx-7 px-7 pt-4 pb-3 flex justify-between items-center backdrop-blur-sm border-t border-gray-100">
                            <button onClick={clearAll} className="text-xs font-medium text-gray-500 hover:text-gray-800">Clear all</button>
                            <Button onClick={() => setDrawerOpen(false)} className="bg-green-500 hover:bg-green-600 text-white shadow-lg px-6 py-2 rounded-lg">
                                Apply
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* search input with icon & clear */}
                <div className="relative flex-1 min-w-[200px] md:min-w-[320px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    {filters.title?.[0] && (
                        <X
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
                            onClick={() => onChange({ ...filters, title: [''] })}
                        />
                    )}
                    <Input
                        placeholder="Search jobs…"
                        value={filters.title?.[0] ?? ''}
                        onChange={e => onChange({ ...filters, title: [e.target.value] })}
                        className="w-full bg-white/60 focus:bg-white border-none focus:ring-2 focus:ring-green-500 rounded-xl pl-11 pr-11 py-3 shadow-inner placeholder-gray-500 text-gray-900"
                    />
                </div>
            </div>

            {/* active chips */}
            <AnimatePresence>
                {chips.length > 0 && (
                    <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                    >
                        {chips.map(({ key, value, raw }) => (
                            <motion.span
                                key={`${key}-${value}`}
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1 cursor-pointer select-none text-xs bg-green-500/10 text-green-600 border border-green-500/30 px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition"
                            >
                                {value}
                                <X
                                    className="w-3 h-3 opacity-70 hover:opacity-100"
                                    onClick={() => toggleValue(key, raw)}
                                />
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
