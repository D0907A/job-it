'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function FilterSidebar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const status = searchParams.get('status') || ''
    const name = searchParams.get('name') || ''

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        startTransition(() => {
            router.push(`/panel/applications?${params.toString()}`)

            router.refresh()
        })
    }

    return (
        <aside className="w-72 shrink-0 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Фільтри</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                        value={status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                    >
                        <option value="">Усі</option>
                        <option value="NEW">New</option>
                        <option value="PENDING">Pending</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Імʼя</label>
                    <input
                        type="text"
                        defaultValue={name}
                        onBlur={(e) => handleFilterChange('name', e.target.value)}
                        placeholder="Пошук за іменем"
                        className="w-full border rounded px-2 py-1 text-sm"
                    />
                </div>
            </div>
        </aside>
    )
}
