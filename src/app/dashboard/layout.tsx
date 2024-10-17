import React from 'react'
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { SiteProvider } from '@/context/SiteContext';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode, params: any }) {
    const user = await currentUser()

    if (user === null) {
        redirect('/sign-in')
    }

    return (
        <SiteProvider>
            <div className='flex min-h-10 bg-gray-100'>
                <Sidebar />

                <div className='ml-auto p-2'>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>

            </div>
            <div className="flex min-h-screen bg-gray-100">
                <div className='flex flex-col w-full'>
                    <div className='px-6'>
                        {children}
                    </div>
                </div>
            </div>
        </SiteProvider>
    );
}


