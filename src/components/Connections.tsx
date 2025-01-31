"use client"

import React, { useState } from 'react'
import { Globe, CheckCircle, Check, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { saveUserSites } from '@/app/actions/google'
import { Site } from '@/types/site'


type Props = {
    userWebsites: Site[]
    subId: string
    userId: string
}

const Connections = ({ userWebsites, subId, userId }: Props) => {
    const [selectedWebsites, setSelectedWebsites] = useState<Site[]>([])
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const { toast } = useToast()

    const handleWebsiteToggle = (website: Site) => {
        const isWebsiteSelected = selectedWebsites.find((site) => (site.id === website.id))

        const newSelectedWebsitesList = isWebsiteSelected !== undefined
            ? selectedWebsites.filter(site => site.id !== website.id) // if website is already in the state we remove it
            : [...selectedWebsites, website] // if website is not in the state we add it

        setSelectedWebsites(newSelectedWebsitesList)
    }

    const handleSubmit = async () => {
        if (selectedWebsites.length > 0) {
            try {
                setLoading(true)
                await saveUserSites(subId, userId, selectedWebsites)
                toast({
                    title: "Scheduled: Catch up ",
                    description: "Friday, February 10, 2023 at 5:57 PM",
                    action: (
                        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                    ),
                })
                router.refresh();
            } finally {
                setLoading(false)
            }
        }
    }

    if (loading) return <h1>Adding Site</h1>

    return (
        <div className="container mx-auto p-4" >
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center">
                        <Globe className="mr-2" />
                        Select Websites to Connect
                    </CardTitle>
                    <CardDescription>
                        Choose which websites you want to connect to our SEO platform. You can select multiple websites.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        {
                            userWebsites.length === 0 ?
                                <div className="border rounded-lg p-6 flex flex-col items-center justify-center space-y-2 h-full">
                                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-lg font-medium text-center">No websites available</p>
                                    <p className="text-sm text-muted-foreground text-center">
                                        This account does not have any sites connected. Please add a website to get started.
                                    </p>
                                </div>
                                :
                                <ScrollArea className="w-full rounded-md border p-4">
                                    {userWebsites.map((website) => (
                                        <div key={website.id} className="flex items-center space-x-2 mb-4">
                                            <Checkbox
                                                id={`website-${website.id}`}
                                                checked={!!selectedWebsites.find((site) => site.id === website.id)}
                                                onCheckedChange={() => handleWebsiteToggle(website)}
                                                disabled={website.permission === "siteUnverifiedUser"}
                                            />
                                            <label
                                                htmlFor={`website-${website.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                            >
                                                {website.url}
                                            </label>
                                        </div>
                                    ))}
                                </ScrollArea>
                        }
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        {selectedWebsites.length} website(s) selected
                    </p>
                    <div className='flex gap-4'>
                        <Button variant="destructive">
                            <Link href='/dashboard'>
                                Cancel
                            </Link>
                        </Button>
                        <Button onClick={() => handleSubmit()} disabled={selectedWebsites.length === 0} variant="outline">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Connect Selected Websites
                        </Button>
                        <Button onClick={() => handleSubmit()} disabled={selectedWebsites.length === 0}>
                            <Check className="mr-2 h-4 w-4" />
                            <Link href='/dashboard'>
                                Finish
                            </Link>
                        </Button>
                    </div>

                </CardFooter>
            </Card>
        </div>
    )
}

export default Connections