"use client"
import React, { useEffect } from 'react'
import { Globe } from 'lucide-react';

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSiteContext } from '@/context/SiteContext';
import Selector from './molecules/Selector';

const WebsiteSelector = () => {
    const { sites, selectedSite, setSelectedSite, loading } = useSiteContext();

    const handleWebsiteChange = (websiteId: string) => {
        const website = sites?.find(w => w.id === Number(websiteId))
        if (website) {
            setSelectedSite(website)
        }
    }

    useEffect(() => {
        if (selectedSite !== null) {
            setSelectedSite(selectedSite)
        }
    }, [selectedSite])


    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold mr-2">SEO Dashboard</CardTitle>
                <Selector sites={sites || []} loading={loading} handleWebsiteChange={handleWebsiteChange} selectedSite={selectedSite} />
            </div>
            <CardDescription className="flex items-center mt-2">
                <Globe className="w-4 h-4 mr-2" />
                Currently viewing: <span className="font-semibold ml-1">{selectedSite?.url}</span>
            </CardDescription>
        </CardHeader>
    )
}

export default WebsiteSelector