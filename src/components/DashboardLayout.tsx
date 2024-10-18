"use client"
import React, { useState } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Sidebar from '@/components/Sidebar';

type Props = {
    children: React.ReactNode
}

const DashboardLayoutWrapper = ({ children }: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <>
            <div className='flex min-h-10 bg-gray-100'>
                <Sidebar setMenu={setIsSidebarOpen} menu={isSidebarOpen} />

                <div className='ml-auto p-2'>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>

            </div>
            <div className={`flex min-h-screen bg-gray-100 ${isSidebarOpen && 'pointer-events-none'}`}>
                <div className='flex flex-col w-full'>
                    <div className='px-6'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayoutWrapper