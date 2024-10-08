"use client"
import { useAuth } from '@clerk/nextjs';
import React, { createContext, useState, useContext, useEffect } from 'react';

import { Site } from '@/types/site';
import { cachedGetSites } from '@/app/actions/cached';


type SiteContextType = {
    sites: Site[] | null;
    selectedSite: Site | null;
    setSelectedSite: (site: Site) => void;
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    removeSite: (siteId: number) => void
    userIdClerk: string
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userId, } = useAuth()

    const userIdClerk = userId as string

    if (userId !== null && userId !== undefined) {
        userId as string
    }

    const [sites, setSites] = useState<Site[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

    useEffect(() => {
        const fetchSites = async () => {
            const fetchedSites = await cachedGetSites(userIdClerk);
            console.log('CALLING ======>', fetchedSites)
            setSites(fetchedSites);
            if (fetchedSites && fetchedSites.length > 0) {
                setSelectedSite(fetchedSites[0]);
            }
            setLoading(false)
        };
        fetchSites();
    }, []);

    const removeSite = (siteId: number): void => {
        const filteredSites = sites?.filter(site => site.id !== siteId)
        if (filteredSites === undefined) {
            setSites([])
            setSelectedSite(null)
        }
        else {
            setSites(filteredSites)
            setSelectedSite(filteredSites[0])
        }
    }

    return (
        <SiteContext.Provider value={{ sites, selectedSite, setSelectedSite, loading, setLoading, removeSite, userIdClerk }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteContext = () => {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSiteContext must be used within a SiteProvider');
    }
    return context;
};