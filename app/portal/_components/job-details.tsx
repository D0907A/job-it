import {
    Briefcase,
    Laptop,
    MapPin,
    Calendar,
    Globe,
    Clock,
    Tag,
    Star
} from 'lucide-react'

export const JobDetails = ({ job }: { job: any }) => {
    return (
        <div className="space-y-6 p-6 bg-white text-gray-900 rounded-2xl shadow-lg border border-slate-200">
            {/* Title & Salary */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
                <p className="text-green-600 text-lg font-semibold">
                    {job.paymentFrom} – {job.paymentTo} грн
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {job.jobType && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 border border-blue-300 rounded-full">
                        <Tag className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
        Тип: {job.jobType}
      </span>
                    </div>
                )}

                {job.experienceLevel && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 border border-green-300 rounded-full">
                        <Star className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
        Рівень: {job.experienceLevel}
      </span>
                    </div>
                )}
            </div>

            {/* Meta Info */}
            <div className="text-sm space-y-3 text-slate-600">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span>{job.company.name}</span>
                </div>

                {job.company?.website && (
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <a
                            href={job.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                        >
                            {job.company.website}
                        </a>
                    </div>
                )}

                {job.workingType && (
                    <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-slate-500" />
                        <span>{job.workingType}</span>
                    </div>
                )}

                {job.employmentType && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>{job.employmentType}</span>
                    </div>
                )}


                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{job.location || 'Локація не вказана'}</span>
                </div>


                {job.validUntil && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>Актуально до {new Date(job.validUntil).toLocaleDateString('uk-UA')}</span>
                    </div>
                )}
            </div>

            {/* Description */}
            {job.description && (
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Опис:</h4>
                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed break-words">
                        {job.description}
                    </p>
                </div>
            )}

            {/* Skills */}
            {job.jobSkills?.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Навички:</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.jobSkills.map((s: any) => (
                            <span
                                key={s.id}
                                className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full shadow-sm"
                            >
                                {s.skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
