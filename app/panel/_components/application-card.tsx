'use client'

import Link from 'next/link'
import {
    Briefcase,
    Calendar,
    Trash,
    Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusPicker, StatusValue } from '@/app/panel/_components/status-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BeatLoader } from 'react-spinners'

interface Application {
    id: string
    jobVacancy: { id: string; title: string }
    applicantName: string
    email: string
    phone?: string
    coverLetter: string
    resumeUrl?: string
    createdAt: string
    status?: StatusValue | null
}

interface Props {
    app: Application
    onDelete: (id: string) => Promise<void>
    onStatusChange: (id: string, newStatus: StatusValue) => void
    deletingId: string | null
}

const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    const date = d.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
    const time = d.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
    })
    return `${date} ${time}`
}

export function ApplicationCard({ app, onDelete, onStatusChange, deletingId }: Props) {
    const isDeleting = deletingId === app.id

    return (
        <article className="bg-white max-w-3xl mx-auto border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <Link
                        href={`jobs/${app.jobVacancy.id}`}
                        className="text-lg font-semibold text-gray-900 hover:underline"
                    >
                        {app.jobVacancy.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
                {app.applicantName}
            </span>
                        <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
                            {formatDateTime(app.createdAt)}
            </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <StatusPicker
                        appId={app.id}
                        current={app.status ?? 'NEW'}
                        onStatusChange={(s) => onStatusChange(app.id, s)}
                    />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-red-600"
                            >
                                {isDeleting ? (
                                    <BeatLoader size={8} color="#EF4444" />
                                ) : (
                                    <Trash className="w-5 h-5" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-4 rounded-md shadow-md bg-white border">
                            <p className="text-sm text-gray-700">
                                Are you sure you want to delete this application?
                            </p>
                            <div className="mt-3 flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(app.id)}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <BeatLoader size={6} color="white" /> : 'Confirm'}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1 border-t pt-3">
                <p>
                    <span className="font-medium text-gray-800">Email:</span>{' '}
                    <a
                        href={`mailto:${app.email}`}
                        className="text-indigo-600 hover:underline"
                    >
                        {app.email}
                    </a>
                </p>
                {app.phone && (
                    <p>
                        <span className="font-medium text-gray-800">Phone:</span> {app.phone}
                    </p>
                )}
            </div>

            <div className="mt-4 text-sm text-gray-700 border-t pt-3">
                <h4 className="font-medium text-gray-800 mb-1">Cover Letter</h4>
                <p className="whitespace-pre-line">{app.coverLetter}</p>
            </div>

            {app.resumeUrl && (
                <div className="mt-4 border-t pt-3">
                    <Link
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:underline text-sm"
                    >
                        <Download className="w-4 h-4 mr-1" />
                        Download Resume
                    </Link>
                </div>
            )}
        </article>
    )
}
