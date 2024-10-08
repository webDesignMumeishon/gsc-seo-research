import { redirect } from 'next/navigation'

import Connections from '@/components/Connections'
import { GetSitesGoogle } from '@/app/actions/google'
import NoKeywordsData from '@/components/NoKeywordsData'

export default async function Page({ searchParams }: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    if (searchParams.access_token === undefined || searchParams.refresh_token === undefined || searchParams.userId === undefined) {
        return redirect('/')
    }

    const sites = await GetSitesGoogle(searchParams.access_token as string, searchParams.refresh_token as string, searchParams.userId as string)

    if (sites === undefined) {
        return <NoKeywordsData />
    }

    return (
        <Connections userWebsites={sites}
            access_token={searchParams.access_token as string}
            refresh_token={searchParams.refresh_token as string}
            userId={searchParams.userId as string}
        />
    )
}