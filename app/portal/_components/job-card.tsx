import {
    Briefcase,
    Laptop,
    MapPin,
    Calendar,
    Heart,
    Eye,
} from 'lucide-react'

interface JobCardProps {
    title: string
    salary: string
    company: string
    location: string
    description?: string
    skills?: string[]
    employmentType?: string
    workingType?: string
    validUntil?: string
    isHot?: boolean
    logoUrl?: string
    viewed?: boolean
    selected?: boolean
}


export const JobCard = ({
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
                            selected
                        }: JobCardProps) => {
    return (
        <div
            className={`relative group rounded-2xl px-5 py-4 shadow-md hover:shadow-lg transition
            ${selected ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-slate-700'}
            bg-[#1f2937] text-white border`}
        >
            {/* Top row */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt="logo"
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{company}</span>
                            {workingType && (
                                <>
                                    <Laptop className="w-4 h-4 ml-2" />
                                    <span>{workingType}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: viewed + save */}
                <div className="flex flex-col items-end gap-2">
                    {viewed && (
                        <div className="text-xs text-slate-400 border border-slate-500 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            viewed
                        </div>
                    )}
                    <button className="text-slate-400 hover:text-indigo-400">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Location */}
            <div className="mt-4 text-sm text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {location}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill, idx) => (
                        <span
                            key={idx}
                            className="bg-slate-800 border border-slate-600 text-slate-100 text-xs px-3 py-1 rounded-full"
                        >
              {skill}
            </span>
                    ))}
                </div>
            )}

            {/* Salary */}
            <div className="mt-4 text-sm font-semibold text-green-400">
                {salary}
            </div>
        </div>
    )
}
