import { FilterSidebar } from "@/app/panel/_components/applications-filter"
import { ApplicationsList } from "@/app/panel/_components/applications-list"

export default function Page() {
    return (
        <div className="flex gap-6 p-6">
            <div className="flex-1 space-y-4 max-w-3xl">
                <ApplicationsList />
            </div>
            <FilterSidebar />
        </div>
    )
}
