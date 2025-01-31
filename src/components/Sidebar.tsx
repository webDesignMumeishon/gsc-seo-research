"use client"
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { BarChart2, ClipboardListIcon, SearchIcon, ServerIcon, } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Menu, ArrowLeftToLine } from "lucide-react"

const sidebarItems = [
    { name: 'Dashboard', icon: BarChart2, href: '/dashboard' },
    { name: 'Connections', icon: ServerIcon, href: '/dashboard/search-console' },
    { name: 'Keywords', icon: ServerIcon, href: '/dashboard/keywords' },
    { name: 'Summary', icon: ClipboardListIcon, href: '/dashboard/summary' },
    { name: 'Indexing', icon: SearchIcon, href: 'dashboard/indexing' },
]

type Props = {
    setMenu: React.Dispatch<React.SetStateAction<boolean>>,
    menu: boolean
}

export default function Sidebar({ setMenu, menu }: Props) {
    const [activeItem, setActiveItem] = useState('Dashboard')

    if (!menu) {
        return (
            <div className='cursor-pointer p-2'>
                <Menu onClick={() => setMenu(true)} />
            </div>
        )
    }

    return (
        <div className='bg-white border-solid rounded-r-xl p-1 border' style={{ zIndex: '1000'}}>
            <div className="flex min-h-screen flex-col  dark:bg-gray-800/40" >
                <div className="p-2 flex align-middle items-center">
                    <h2 className="text-md font-semibold tracking-tight p-2">
                        <Link href="/">
                            <Image src="/logo-100x100.png" alt="Console Insight Logo" width={160} height={50} className='min-w-[110px]' />
                        </Link>
                    </h2>
                    <ArrowLeftToLine size={20} className='cursor-pointer text-slate-600' onClick={() => setMenu(false)} />
                </div>
                <ScrollArea className="flex-1">
                    <nav className="grid gap-1 px-2">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.name}
                                variant={activeItem === item.name ? null : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    activeItem === item.name
                                        ? "bg-primary dark:bg-gray-700 text-white"
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700 "
                                )}
                                onClick={() => {
                                    setActiveItem(item.name)
                                }}
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
        </div>
    )
}