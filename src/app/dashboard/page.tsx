"use client"
import { webmasters_v3 } from 'googleapis'
import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GetPagesListCache, GetQueriesByPage } from '@/actions/google'
import { useSiteContext } from '@/context/SiteContext'
import NoKeywordsData from '@/components/NoKeywordsData'
import { PageQuery } from '@/interfaces'
import ListPages from '@/components/ListPages'
import PageQueries from '@/components/Queries'


const Page = () => {
    const [selectedPage, setSelectedPage] = useState<number | null>(null)
    const [queriesData, setQueriesData] = useState<any>([])
    const { selectedSite, loading } = useSiteContext();
    const [pagesData, setpagesData] = useState<PageQuery[]>([])

    useEffect(() => {
        const fetch = async (page: string) => {
            const result = await GetPagesListCache(page);
            setpagesData(result)
        }

        if (selectedSite !== null && selectedSite !== undefined) {
            setSelectedPage(null)
            fetch(selectedSite.name)
        }
    }, [selectedSite])

    const handlePageClick = async (pageId: number, pageUrl: string) => {
        if (selectedSite?.name !== undefined) {
            const result = await GetQueriesByPage(selectedSite?.name, pageUrl)
            setQueriesData(result)
            setSelectedPage(pageId)
        }
        else {
            throw new Error('Site does not exist')
        }
    }

    const handleBackClick = () => {
        setSelectedPage(null)
    }

    if (loading) {
        return <h1>Loading</h1>
    }

    if (pagesData.length === 0) {
        return <NoKeywordsData />
    }

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {selectedPage === null ? 'Pages and Queries Overview' : `Queries for ${pagesData.find(p => p.id === selectedPage)?.page}`}
                </CardTitle>
                <CardDescription>
                    {selectedPage === null ? 'Click on a page to view its queries' : 'Detailed query information for the selected page'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {selectedPage !== null ? (
                    <PageQueries
                        queriesData={queriesData}
                        handleBackClick={handleBackClick}
                    />
                )
                    :
                    <ScrollArea className="h-[600px] w-full" style={{ border: 'red solid 1px' }}>
                        {selectedPage === null && (
                            <ListPages pagesData={pagesData} handlePageClick={handlePageClick} />
                        )}
                    </ScrollArea>
                }

            </CardContent>
        </Card>
    )
}

export default Page