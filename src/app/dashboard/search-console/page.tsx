
import React from 'react'
import ManageConnections from '@/components/organisms/ManageConnections'
import { auth } from '@clerk/nextjs/server'
import { cachedGetSites } from '@/app/actions/cached'



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