/*
 * JobCard.tsx – v6 (compact)
 * Goal: tighter vertical spacing & smaller footprint while preserving readability.
 * Changes:
 * – Outer padding reduced (p-4), inner margins tightened.
 * – Logo 48×48 instead of 56×56.
 * – Badges inline with title again (they wrap if needed) to save vertical space.
 * – Divider removed; bottom meta sits directly under skills.
 * – Text sizes: title  lg → base for meta etc.
 */
import {
    Briefcase,
    Laptop,
    MapPin,
    Calendar,
    Heart,
    Eye,
    Flame,
    Tag,
    Signal,
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
    validUntil?: string;
    jobLevel?: string;
    jobType?: string;
    isHot?: boolean;
    logoUrl?: string;
    viewed?: boolean;
    authorId: string;
    selected?: boolean;
    imageUrl?: string;
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
                            jobLevel,
                            jobType,
                            logoUrl,
                            viewed = false,
                            isHot = false,
                            selected,
                            imageUrl
                        }: JobCardProps) => {
    return (
        <article
            className={`relative group rounded-xl p-4 transition shadow hover:shadow-lg bg-slate-800 text-white border  ${
                selected ? 'border-indigo-400 ring-2 ring-indigo-300' : 'border-slate-700'
            } ${isHot ? 'ring-2 ring-rose-500/70' : ''}`}
        >
            {/* HOT badge */}
            {isHot && (
                <div className="absolute -top-2 -left-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                    <Flame className="w-3 h-3" /> HOT
                </div>
            )}

            {/* VIEWED badge */}
            {viewed && (
                <div className="absolute -top-2 right-2 bg-slate-700 text-slate-300 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-slate-500">
                    <Eye className="w-3 h-3" /> Viewed
                </div>
            )}

            {/* Header row */}
            <div className="flex items-start gap-3">
                {/* Logo */}
                <div className="flex-shrink-0">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${company} logo`}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-700 grid place-content-center text-slate-400 text-[10px] uppercase font-medium">
                            {company.slice(0, 2)}
                        </div>
                    )}
                </div>


                {/* Title & meta */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold truncate group-hover:text-indigo-300 transition">
                            {title}
                        </h3>
                        {jobLevel && (
                            <span className="flex items-center gap-0.5 bg-slate-700 border border-slate-600 px-1.5 py-0.5 rounded text-[10px] uppercase">
                <Signal className="w-3 h-3" /> {jobLevel}
              </span>
                        )}
                        {jobType && (
                            <span className="flex items-center gap-0.5 bg-slate-700 border border-slate-600 px-1.5 py-0.5 rounded text-[10px] uppercase">
                <Tag className="w-3 h-3" /> {jobType}
              </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {company}
            </span>
                        {workingType && (
                            <span className="flex items-center gap-1">
                <Laptop className="w-3 h-3" /> {workingType.toLowerCase()}
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
            <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> {location}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {skills.slice(0, 4).map((skill, idx) => (
                        <span
                            key={idx}
                            className="bg-slate-700/60 border border-slate-600 text-[10px] px-2 py-0.5 rounded-full"
                        >
              {skill}
            </span>
                    ))}
                    {skills.length > 4 && (
                        <span className="text-[10px] text-slate-400">+{skills.length - 4}</span>
                    )}
                </div>
            )}

            {/* Bottom meta */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                <span className="text-base font-bold text-emerald-400">{salary}</span>

                <div className="flex flex-wrap gap-2">
                    {employmentType && (
                        <span className="bg-slate-700 border border-slate-600 px-1.5 py-0.5 rounded uppercase">
              {employmentType.replaceAll('_', ' ')}
            </span>
                    )}
                    {workingType && (
                        <span className="bg-slate-700 border border-slate-600 px-1.5 py-0.5 rounded uppercase">
              {workingType}
            </span>
                    )}
                    {validUntil && (
                        <span className="flex items-center gap-0.5 bg-slate-700 border border-slate-600 px-1.5 py-0.5 rounded">
              <Calendar className="w-3 h-3" /> {new Date(validUntil).toLocaleDateString()}
            </span>
                    )}
                </div>
            </div>
        </article>
    );
};
