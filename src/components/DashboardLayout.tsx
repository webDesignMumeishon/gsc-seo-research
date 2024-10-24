"use client"
import React, { useState } from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Sidebar from '@/components/Sidebar';

type Props = {
    children: React.ReactNode
}

const DashboardLayoutWrapper = ({ children }: Props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <>

            {/* <div className='absolute'>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div> */}

            <div className={`flex min-h-screen bg-gray-100 `}>
                <Sidebar setMenu={setIsSidebarOpen} menu={isSidebarOpen} />

                <div className={`flex flex-col w-full items-center`} style={{ cursor: isSidebarOpen ? 'pointer' : 'auto' }}>
                    <div className='px-6 w-[80rem] p-4'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayoutWrapper