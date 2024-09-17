"use client"
import React, { useEffect, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from 'lucide-react';
import { useSiteContext } from '@/context/SiteContext';

const WebsiteSelector = () => {
    const { sites, selectedSite, setSelectedSite, loading } = useSiteContext();

    const handleWebsiteChange = (websiteId: string) => {
        const website = sites?.find(w => w.id === websiteId)
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
                <CardTitle className="text-2xl font-bold">SEO Dashboard</CardTitle>
                <Select value={selectedSite?.id} onValueChange={handleWebsiteChange}>
                    {
                        loading ?
                            <p>Loading</p>
                            :
                            (
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Select website" />
                                </SelectTrigger>
                            )
                    }
                    <SelectContent>
                        {sites?.map((website) => (
                            <SelectItem key={website.id} value={website.id}>
                                {website.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <CardDescription className="flex items-center mt-2">
                <Globe className="w-4 h-4 mr-2" />
                Currently viewing: <span className="font-semibold ml-1">{selectedSite?.name}</span>
            </CardDescription>
        </CardHeader>
    )
}

export default WebsiteSelector