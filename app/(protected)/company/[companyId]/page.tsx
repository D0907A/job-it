'use server'

import { checkOwnerOfTheCompany, getCompanyById } from '@/actions/company'
import { currentUser } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import CompanyForm from '@/components/company-settings'
import { Company } from '.prisma/client'
import CardLayout from '../../_components/admin-card-layout'

interface CompanyPageProps {
    params: { companyId: string }
}

const CompanyPage = async ({ params }: CompanyPageProps) => {
    const user = await currentUser()
    if (!user) return notFound()

    const { companyId } = params

    if (companyId === 'new') {
        return (
            <CardLayout title="Create New Company" backUrl="/dashboard">
                <CompanyForm company={{ id: 'new' } as Partial<Company>} />
            </CardLayout>
        )
    }

    const isOwner = await checkOwnerOfTheCompany(companyId, user.id)
    if (!isOwner) return redirect('/forbidden')

    const company = await getCompanyById(companyId)
    if (!company) return notFound()

    return (
        <CardLayout title="Edit Company" backUrl="/dashboard">
            <CompanyForm company={company} />
        </CardLayout>
    )
}

export default CompanyPage
