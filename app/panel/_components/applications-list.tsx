'use client';

import { useState } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Trash,
    Download,
    Briefcase,
    Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { updateApplicationStatus } from '@/actions/application'

const STATUSES = [
    { value: 'NEW',   label: 'New' },
    { value: 'PENDING',   label: 'Pending' },
    { value: 'STARRED',   label: 'Starred' },
    { value: 'INTERVIEW', label: 'Interview' },
    { value: 'REJECTED',  label: 'Rejected' },
    { value: 'ACCEPTED',  label: 'Accepted' },
] as const

type StatusValue = typeof STATUSES[number]['value']

interface StatusPickerProps {
    appId: string
    current: StatusValue
    onStatusChange: (newStatus: StatusValue) => void
}

function StatusPicker({ appId, current, onStatusChange }: StatusPickerProps) {
    const [status, setStatus] = useState<StatusValue>(current)
    const [updating, setUpdating] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusValue
        setStatus(newStatus)
        onStatusChange(newStatus)

        setUpdating(true)
        try {
            await updateApplicationStatus(appId, newStatus)
        } catch (err) {
            console.error('Failed to update status', err)
            // revert on error
            setStatus(current)
            onStatusChange(current)
        } finally {
            setUpdating(false)
        }
    }

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={updating}
            className="text-xs font-medium px-2 py-0.5 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none"
        >
            {STATUSES.map(({ value, label }) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    )
}

interface Application {
    id: string
    jobVacancy: { id: string; title: string }
    applicantName: string
    email: string
    phone?: string
    coverLetter: string
    resumeUrl?: string
    createdAt: string
    status: StatusValue
}

export default function ApplicationsList({
                                             initialApps,
                                         }: {
    initialApps: Application[]
}) {
    const [apps, setApps] = useState(initialApps)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            // await deleteApplication(id)
            setApps((prev) => prev.filter((a) => a.id !== id))
        } catch {
            // ignore
        } finally {
            setDeletingId(null)
        }
    }

    const handleStatusChange = (id: string, newStatus: StatusValue) => {
        setApps((prev) =>
            prev.map((app) =>
                app.id === id
                    ? {
                        ...app,
                        status: newStatus,
                    }
                    : app
            )
        )
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

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <Link
                    href="/panel"
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold">Applications Received</h1>
            </div>

            {/* List */}
            {apps.length === 0 ? (
                <p className="text-center text-gray-500">No applications yet.</p>
            ) : (
                <div className="space-y-4">
                    {apps.map((app) => (
                        <article
                            key={app.id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            {/* Title + Status + Delete */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href={`/jobs?job=${app.jobVacancy.id}`}
                                        className="text-lg font-semibold text-gray-800 hover:underline"
                                    >
                                        {app.jobVacancy.title}
                                    </Link>
                                    <StatusPicker
                                        appId={app.id}
                                        current={app.status}
                                        onStatusChange={(s) => handleStatusChange(app.id, s)}
                                    />
                                </div>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={deletingId === app.id}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-3 bg-white rounded-md shadow-lg">
                                        <p className="text-sm text-gray-700">Delete this application?</p>
                                        <div className="flex justify-end space-x-2 mt-2">
                                            <Button variant="outline" size="sm">
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(app.id)}
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    Applicant
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateTime(app.createdAt)}
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="mt-3 text-gray-700 space-y-1 text-sm">
                                <p>
                                    <span className="font-medium">Name:</span> {app.applicantName}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span>{' '}
                                    <a
                                        href={`mailto:${app.email}`}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        {app.email}
                                    </a>
                                </p>
                                {app.phone && (
                                    <p>
                                        <span className="font-medium">Phone:</span> {app.phone}
                                    </p>
                                )}
                            </div>

                            {/* Cover Letter */}
                            <div className="mt-3 text-sm text-gray-600">
                                <h4 className="font-medium text-gray-800 mb-1">Cover Letter</h4>
                                <p className="whitespace-pre-line">{app.coverLetter}</p>
                            </div>

                            {/* Resume */}
                            {app.resumeUrl && (
                                <div className="mt-3">
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
                    ))}
                </div>
            )}
        </div>
    )
}
