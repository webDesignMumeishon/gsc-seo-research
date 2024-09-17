"use client"
// context/SiteContext.tsx
import { GetSites, GetSitesCache } from '@/actions/google';
import React, { createContext, useState, useContext, useEffect } from 'react';


type Site = {
    id: string;
    name: string;
    // Add other site properties
};

type SiteContextType = {
    sites: Site[] | null;
    selectedSite: Site | null;
    setSelectedSite: (site: Site) => void;
    loading: boolean
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sites, setSites] = useState<Site[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);

    useEffect(() => {
        const fetchSites = async () => {
            const fetchedSites = await GetSitesCache(3);
            setSites(fetchedSites);
            if (fetchedSites && fetchedSites.length > 0) {
                setSelectedSite(fetchedSites[0]);
            }
            setLoading(false)
        };
        fetchSites();
    }, []);

    return (
        <SiteContext.Provider value={{ sites, selectedSite, setSelectedSite, loading }}>
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