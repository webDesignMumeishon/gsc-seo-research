
import React from 'react'
import ManageConnections from '@/components/organisms/ManageConnections'
import { cachedGetSites } from '@/app/actions/sites'
import { auth } from '@clerk/nextjs/server'



export default async function Page() {

    const { userId } = auth()

    if (userId === null) {
        throw new Error("missing userid")
    }

    const sites = await cachedGetSites(userId)

    return (
        <ManageConnections userSites={sites} />
    )
}