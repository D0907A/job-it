import {
    Briefcase,
    Laptop,
    MapPin,
    Calendar,
    Globe,
    Clock,
    Tag,
    Star,
} from 'lucide-react';

export const JobDetails = ({ job }: { job: any }) => {
    return (
        <div className="w-full max-w-full md:max-w-lg space-y-6 p-4 sm:p-6 bg-white text-gray-900 rounded-2xl shadow-lg border border-slate-200 mx-auto">
            {/* Title & Salary */}
            <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    {job.title}
                </h2>
                <p className="text-green-600 text-base sm:text-lg font-semibold">
                    {job.paymentFrom} – {job.paymentTo} грн
                </p>
            </div>

            {/* Type & Level Badges */}
            <div className="flex flex-wrap items-center gap-2">
                {job.jobType && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 border border-blue-300 rounded-full">
                        <Tag className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-600">
              Тип: {job.jobType.toLowerCase()}
            </span>
                    </div>
                )}
                {job.experienceLevel && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 border border-green-300 rounded-full">
                        <Star className="w-5 h-5 sm:w-4 sm:h-4 text-green-600" />
                        <span className="text-xs sm:text-sm font-medium text-green-600">
              Рівень: {job.experienceLevel.toLowerCase()}
            </span>
                    </div>
                )}
            </div>

            {/* Meta Info */}
            <div className="text-sm sm:text-base space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500" />
                    <span>{job.company.name}</span>
                </div>

                {job.company?.website && (
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500" />
                        <a
                            href={job.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline break-all"
                        >
                            {job.company.website}
                        </a>
                    </div>
                )}

                {job.workingType && (
                    <div className="flex items-center gap-2">
                        <Laptop className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500" />
                        <span>{job.workingType}</span>
                    </div>
                )}

                {job.employmentType && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500" />
                        <span>{job.employmentType}</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500" />
                    <span>{job.location || 'Локація не вказана'}</span>
                </div>

                {job.validUntil && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500" />
                        <span>
              Актуально до{' '}
                            {new Date(job.validUntil).toLocaleDateString('uk-UA')}
            </span>
                    </div>
                )}
            </div>

            {/* Description */}
            {job.description && (
                <div>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-700 mb-1">
                        Опис:
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 whitespace-pre-line leading-relaxed break-words">
                        {job.description}
                    </p>
                </div>
            )}

            {/* Skills */}
            {job.jobSkills?.length > 0 && (
                <div>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-700 mb-2">
                        Навички:
                    </h4>
                    <div className="flex flex-wrap gap-2 overflow-x-auto">
                        {job.jobSkills.map((s: any) => (
                            <span
                                key={s.id}
                                className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm px-2 py-1 rounded-full whitespace-nowrap"
                            >
                {s.skill.toLowerCase()}
              </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
