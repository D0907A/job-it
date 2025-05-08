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
        <aside className="w-full lg:w-72 shrink-0 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Фільтри</h2>

            <div className="space-y-5">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Статус
                    </label>
                    <select
                        value={status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Усі</option>
                        <option value="NEW">New</option>
                        <option value="PENDING">Pending</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                {/* Name Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ім’я
                    </label>
                    <input
                        type="text"
                        defaultValue={name}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilterChange('name', (e.target as HTMLInputElement).value)
                            }
                        }}
                        onBlur={(e) => handleFilterChange('name', e.target.value)}
                        placeholder="Пошук за іменем"
                        className="w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>
        </aside>
    )
}
