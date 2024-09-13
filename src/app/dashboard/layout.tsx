import Sidebar from '@/components/Sidebar';
import React from 'react'

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            {children}
        </div>
    );
}
