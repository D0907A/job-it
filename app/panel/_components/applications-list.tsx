'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getApplicationsForUserJobs, deleteApplication } from '@/actions/application'
import { ApplicationCard } from './application-card'
import { StatusValue } from './status-picker'
import { toast } from 'sonner'

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

export function ApplicationsList() {
    const searchParams = useSearchParams()
    const [apps, setApps] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const status = searchParams.get('status') || ''
    const name = searchParams.get('name') || ''

    useEffect(() => {
        setLoading(true)
        getApplicationsForUserJobs({ status, name })
            .then(data => setApps(data))
            .catch(() => toast.error('Failed to load applications'))
            .finally(() => setLoading(false))
    }, [status, name])

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await deleteApplication(id)
            setApps(prev => prev.filter(app => app.id !== id))
            toast.success('Deleted')
        } catch {
            toast.error('Failed to delete')
        } finally {
            setDeletingId(null)
        }
    }

    const handleStatusChange = (id: string, newStatus: StatusValue) => {
        setApps(prev =>
            prev.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            )
        )
    }

    return (
        <>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : apps.length === 0 ? (
                <p className="text-sm text-gray-500">No applications found.</p>
            ) : (
                apps.map(app => (
                    <ApplicationCard
                        key={app.id}
                        app={app}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                        deletingId={deletingId}
                    />
                ))
            )}
        </>
    )
}
