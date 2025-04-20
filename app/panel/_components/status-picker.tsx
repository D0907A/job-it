'use client'

import { useEffect, useState } from 'react'
import { updateApplicationStatus } from '@/actions/application'
import {toast} from "sonner";


const STATUSES = [
    { value: 'NEW', label: 'New' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'STARRED', label: 'Starred' },
    { value: 'INTERVIEW', label: 'Interview' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'ACCEPTED', label: 'Accepted' },
] as const

export type StatusValue = typeof STATUSES[number]['value']

interface StatusPickerProps {
    appId: string
    current: StatusValue
    onStatusChange: (newStatus: StatusValue) => void
}

export function StatusPicker({ appId, current, onStatusChange }: StatusPickerProps) {
    const [status, setStatus] = useState<StatusValue>('NEW')
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        if (STATUSES.some(s => s.value === current)) {
            setStatus(current)
        } else {
            setStatus('NEW')
        }
    }, [current])

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusValue
        setStatus(newStatus)
        onStatusChange(newStatus)

        setUpdating(true)
        try {
            await updateApplicationStatus(appId, newStatus)
        } catch (err) {
            console.error('Failed to update status', err)
            setStatus(current)
            onStatusChange(current)
        } finally {
            setUpdating(false)
            toast.success("Status updated")
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

export { STATUSES }
