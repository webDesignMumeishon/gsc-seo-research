
import React from 'react'
import { USER_ID } from '@/utils'
import { GetSitesCache } from '@/actions/google'
import ManageConnections from '@/components/organisms/ManageConnections'



export default async function Page() {
    const sites = await GetSitesCache(USER_ID)

    return (
        <ManageConnections userSites={sites} />
    )
}