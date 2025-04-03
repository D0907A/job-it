'use client'

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {BeatLoader} from "react-spinners";
import {Trash} from "lucide-react";
import {createJob, getJobsByUserId} from "@/actions/jobs";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getUserCompany} from "@/actions/company";
import JobsList from "@/app/(protected)/_components/jobsList";

const JobsAdmin = ()   =>{

    const addCompanyOnClick = () => {
        getJobsByUserId();
    }

    const [companies, setCompanies] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        async function fetchCompanies() {
            const companiesList = await getUserCompany()
            setCompanies(companiesList)
        }

        fetchCompanies()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            await createJob(formData)
            router.push('/jobs')
        } catch (err) {
            setError('Failed to create job')
        }
    }



    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">Jobs</p>
            </CardHeader>
            <CardContent className="space-y-4">

                <>
                    <div className="flex flex-row justify-end">
                        <Button onClick={addCompanyOnClick} href="/new">Add new</Button>
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                        <h1 className="text-xl font-bold">Create a Job</h1>

                        {error && <p className="text-red-500">{error}</p>}

                        <input name="title" placeholder="Job title" className="w-full p-2 border rounded" required />
                        <textarea name="description" placeholder="Job description" className="w-full p-2 border rounded" required />

                        <select name="companyId" className="w-full p-2 border rounded" required>
                            <option value="">Select Company</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                            Post Job
                        </button>
                    </form>

                    {/*{companies.map((company) => (*/}
                    {/*    <div*/}
                    {/*        key={company.id}*/}
                    {/*        className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm hover:bg-gray-100 transition"*/}
                    {/*    >*/}
                    {/*        <Link href={`/company/${company.id}`} className="block flex-1">*/}
                    {/*            <p className="text-sm font-medium">{company.name}</p>*/}
                    {/*            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">*/}
                    {/*                {company.description || "No description"}*/}
                    {/*            </p>*/}
                    {/*        </Link>*/}
                    {/*        <div>*/}
                    {/*            <Button*/}
                    {/*                onClick={() => onClickDeleteCompany(company.id)}*/}
                    {/*                variant="destructive"*/}
                    {/*                size="sm"*/}
                    {/*                className="flex items-center gap-1"*/}
                    {/*                disabled={deletingId === company.id} // Disable while deleting*/}
                    {/*            >*/}
                    {/*                {deletingId === company.id ? (*/}
                    {/*                    <BeatLoader size={8} color="white" />*/}
                    {/*                ) : (*/}
                    {/*                    <>*/}
                    {/*                        Delete*/}
                    {/*                        <Trash className="w-4 h-4" />*/}
                    {/*                    </>*/}
                    {/*                )}*/}
                    {/*            </Button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </>
            </CardContent>
        </Card>
    )
}

export default JobsAdmin;