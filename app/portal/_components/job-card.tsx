/*
 * JobCard.tsx – elevated, info‑rich card to showcase each vacancy
 * Highlights:
 * – "HOT" badge, dynamic highlight when isHot
 * – Salary emphasised, meta chips (employment, working type, expiry)
 * – Viewed tag + favourite heart
 * – Smooth hover ring & shadow
 */
import {
    Briefcase,
    Laptop,
    MapPin,
    Calendar,
    Heart,
    Eye,
    Flame,
} from 'lucide-react';

interface JobCardProps {
    id: string;
    title: string;
    salary: string;
    company: string;
    location: string;
    description?: string;
    skills?: string[];
    employmentType?: string;
    workingType?: string;
    validUntil?: string; // ISO date string
    isHot?: boolean;
    logoUrl?: string;
    viewed?: boolean;
    authorId: string;
    selected?: boolean;
}

export const JobCard = ({
                            id,
                            title,
                            salary,
                            company,
                            location,
                            skills = [],
                            employmentType,
                            workingType,
                            validUntil,
                            logoUrl,
                            viewed = false,
                            isHot = false,
                            selected,
                        }: JobCardProps) => {
    return (
        <article
            className={`relative group rounded-2xl p-6 transition shadow-md hover:shadow-xl bg-slate-800 text-white border  ${
                selected ? 'border-indigo-400 ring-2 ring-indigo-300' : 'border-slate-700'
            } ${isHot ? 'ring-2 ring-rose-500/70' : ''}`}
        >
            {/* HOT badge */}
            {isHot && (
                <div className="absolute -top-3 -left-3 bg-rose-600 text-white text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3" /> HOT
                </div>
            )}

            {/* VIEWED badge */}
            {viewed && (
                <div className="absolute -top-3 right-3 bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-500">
                    <Eye className="w-3 h-3" /> Viewed
                </div>
            )}

            {/* Header row */}
            <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                    {logoUrl ? (
                        <img src={logoUrl} alt="logo" className="w-14 h-14 rounded-lg object-cover" />
                    ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-700 grid place-content-center text-slate-400 text-xs uppercase font-medium">
                            {company.slice(0, 2)}
                        </div>
                    )}
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold leading-snug truncate group-hover:text-indigo-300 transition">
                        {title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300 mt-1">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
                {company}
            </span>
                        {workingType && (
                            <span className="flex items-center gap-1">
                <Laptop className="w-4 h-4" /> {workingType.toLowerCase()}
              </span>
                        )}
                    </div>
                </div>

                {/* Favourite */}
                <button
                    className="text-slate-400 hover:text-rose-500 transition p-1 rounded-md hover:bg-slate-700"
                    aria-label="Save job"
                >
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            {/* Location */}
            <div className="mt-4 text-sm text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {location}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {skills.slice(0, 6).map((skill, idx) => (
                        <span
                            key={idx}
                            className="bg-slate-700/60 border border-slate-600 text-slate-100 text-[11px] px-3 py-1 rounded-full"
                        >
              {skill}
            </span>
                    ))}
                    {skills.length > 6 && (
                        <span className="text-xs text-slate-400">+{skills.length - 6} more</span>
                    )}
                </div>
            )}

            {/* Divider */}
            <hr className="my-5 border-slate-700/60" />

            {/* Bottom meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                {/* salary */}
                <span className="text-lg font-bold text-emerald-400">{salary}</span>

                {/* meta chips */}
                <div className="flex flex-wrap gap-2">
                    {employmentType && (
                        <span className="bg-slate-700 border border-slate-600 px-2 py-0.5 rounded-lg uppercase tracking-wide">
              {employmentType.replaceAll('_', ' ')}
            </span>
                    )}
                    {workingType && (
                        <span className="bg-slate-700 border border-slate-600 px-2 py-0.5 rounded-lg uppercase tracking-wide">
              {workingType}
            </span>
                    )}
                    {validUntil && (
                        <span className="flex items-center gap-1 bg-slate-700 border border-slate-600 px-2 py-0.5 rounded-lg">
              <Calendar className="w-3 h-3" /> {new Date(validUntil).toLocaleDateString()}
            </span>
                    )}
                </div>
            </div>
        </article>
    );
};
