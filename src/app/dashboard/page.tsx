"use client"
import { webmasters_v3 } from 'googleapis'
import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GetPagesListCache } from '@/actions/google'
import { useSiteContext } from '@/context/SiteContext'
import NoKeywordsData from '@/components/NoKeywordsData'
import { PageQuery } from '@/types'
import ListPages from '@/components/ListPages'
import PageQueries from '@/components/Queries'


const Page = () => {
    const [selectedPage, setSelectedPage] = useState<number | null>(null)
    const { selectedSite } = useSiteContext();
    const [pagesData, setpagesData] = useState<PageQuery[]>([])

    const [localLoading, setLocalLoading] = useState(true)


    useEffect(() => {
        const fetch = async (page: string) => {
            setLocalLoading(true)
            const result = await GetPagesListCache(page, 1);
            setpagesData(result)
            setLocalLoading(false)
        }

        if (selectedSite !== null && selectedSite !== undefined) {
            setSelectedPage(null)
            fetch(selectedSite.url)
        }
    }, [selectedSite])

    const handlePageClick = async (pageId: number, pageUrl: string) => {
        if (selectedSite?.url !== undefined) {
            setSelectedPage(pageId)
        }
        else {
            throw new Error('Site does not exist')
        }
    }

    const handleBackClick = () => {
        setSelectedPage(null)
    }

    if (localLoading) {
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
                        site={selectedSite?.url || ''}
                        pageUrl={pagesData.find(p => p.id === selectedPage)?.page || ''}
                        handleBackClick={handleBackClick}
                    />
                )
                    :
                    <ScrollArea className="h-[600px] w-full">
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