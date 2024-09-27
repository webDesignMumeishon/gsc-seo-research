"use client"
import { GetSitesCache } from '@/actions/google';
import { Site } from '@/types/site';
import React, { createContext, useState, useContext, useEffect } from 'react';


type SiteContextType = {
    sites: Site[] | null;
    selectedSite: Site | null;
    setSelectedSite: (site: Site) => void;
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    removeSite: (siteId: number) => void
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sites, setSites] = useState<Site[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

    useEffect(() => {
        const fetchSites = async () => {
            const fetchedSites = await GetSitesCache(1);
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
        <SiteContext.Provider value={{ sites, selectedSite, setSelectedSite, loading, setLoading, removeSite }}>
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