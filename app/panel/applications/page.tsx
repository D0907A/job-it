import { FilterSidebar } from "@/app/panel/_components/applications-filter"
import { ApplicationsList } from "@/app/panel/_components/applications-list"

export default function Page() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 h-screen p-6 overflow-hidden">
            {/* Filters at the top on mobile, right side on desktop */}
            <div className="lg:order-2 w-full lg:w-72 shrink-0">
                <FilterSidebar />
            </div>

            {/* Scrollable applications list */}
            <div className="flex-1 max-w-3xl overflow-y-auto space-y-4 pr-2">
                <ApplicationsList />
            </div>
        </div>
    )
}
