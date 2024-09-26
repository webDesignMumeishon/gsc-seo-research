
import React from 'react'
import { USER_ID } from '@/utils'
import ManageConnections from '@/components/ManageConnections'
import { GetSitesCache } from '@/actions/google'



export default async function Page() {
    const sites = await GetSitesCache(USER_ID)

    return (
        <ManageConnections userSites={sites} />
    )
}