import React from 'react'
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { SiteProvider } from '@/context/SiteContext';
import Sidebar from '@/components/Sidebar';
import DashboardLayoutWrapper from '@/components/DashboardLayout';

export default async function DashboardLayout({ children }: { children: React.ReactNode, params: any }) {
    const user = await currentUser()

    if (user === null) {
        redirect('/sign-in')
    }

    return (
        <SiteProvider>
            <DashboardLayoutWrapper children={children} />
        </SiteProvider>
    );
}


