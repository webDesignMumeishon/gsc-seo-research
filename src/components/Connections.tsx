"use client"

import React, { useState } from 'react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Globe, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { saveUserSites, Sites } from '@/actions/google'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
    userWebsites: any[]
    access_token: string
    refresh_token: string
    userId: string
}

const Connections = ({ userWebsites, access_token, refresh_token, userId }: Props) => {
    const [selectedWebsites, setSelectedWebsites] = useState<Sites[]>([])
    const router = useRouter()

    const { toast } = useToast()

    const handleWebsiteToggle = (websiteId: string) => {
        const site = userWebsites.find(site => site.id === websiteId)
        setSelectedWebsites(prev => prev.find((site) => site.id === Number(websiteId)) ? prev.filter(site => site.id !== Number(websiteId)) : [...prev, site])
    }

    const handleSubmit = async () => {
        const sitesCreated = await saveUserSites(access_token, refresh_token, Number(userId), selectedWebsites)
        toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: (
                <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
        })
        router.refresh();
    }
    return (
        <div className="container mx-auto p-4">
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
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        {userWebsites.map((website) => (
                            <div key={website.id} className="flex items-center space-x-2 mb-4">
                                <Checkbox
                                    id={`website-${website.id}`}
                                    checked={!!selectedWebsites.find((site) => site.id === website.id)}
                                    onCheckedChange={() => handleWebsiteToggle(website.id)}
                                />
                                <label
                                    htmlFor={`website-${website.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                                >
                                    <span className="mr-2">{website.icon}</span>
                                    {website.url}
                                </label>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        {selectedWebsites.length} website(s) selected
                    </p>
                    <div className='flex gap-4'>
                        <Button onClick={() => handleSubmit()} disabled={selectedWebsites.length === 0} variant="outline">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Connect Selected Websites
                        </Button>
                        <Button >
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