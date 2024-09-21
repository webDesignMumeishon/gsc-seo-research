"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'
import { BarChart2, ClipboardListIcon, SearchIcon, ServerIcon, } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { name: 'Dashboard', icon: BarChart2, href: '/dashboard' },
    { name: 'Connections', icon: ServerIcon, href: '/dashboard/search-console' },
    { name: 'Summary', icon: ClipboardListIcon, href: '/dashboard/summary' },
    { name: 'Indexing', icon: SearchIcon, href: 'dashboard/indexing' },
]

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('Dashboard')
    return (
        <div className="flex h-screen flex-col border-r  dark:bg-gray-800/40">
            <div className="p-2">
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                    <Link href="/">
                        <Image src="/logo.png" alt="Console Insight Logo" width={200} height={100} />
                    </Link>
                </h2>
            </div>
            <ScrollArea className="flex-1">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.name}
                            variant={activeItem === item.name ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                activeItem === item.name
                                    ? "bg-gray-200 dark:bg-gray-700"
                                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                            onClick={() => setActiveItem(item.name)}
                            asChild
                        >
                            <Link href={`${item.href}`}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </ScrollArea>
        </div>
    )
}