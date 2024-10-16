import { redirect } from 'next/navigation'

import Connections from '@/components/Connections'
import { GetSitesGoogle } from '@/app/actions/google'
import NoKeywordsData from '@/components/NoKeywordsData'

export default async function Page({ searchParams }: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    if (searchParams.subId === undefined || searchParams.userId === undefined) {
        return redirect('/')
    }

    const sites = await GetSitesGoogle(searchParams.subId as string, searchParams.userId as string)

    if (sites === undefined) {
        return <NoKeywordsData />
    }

    return (
        <Connections
            userWebsites={sites}
            subId={searchParams.subId as string}
            userId={searchParams.userId as string}
        />
    )
}