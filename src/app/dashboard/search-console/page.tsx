"use client"

import React, { useState } from 'react'
import axios from 'axios'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { XCircle, AlertTriangle } from 'lucide-react'
import { USER_ID } from '@/utils'
import { useRouter } from 'next/navigation'

type Property = {
    id: string;
    url: string;
    lastSync: string;
}

export default function Page() {
    const [properties, setProperties] = useState<Property[]>([
        { id: '1', url: 'https://www.example.com', lastSync: '2 hours ago' },
        { id: '2', url: 'https://blog.example.com', lastSync: '1 day ago' },
        { id: '3', url: 'https://shop.example.com', lastSync: '3 days ago' },
    ])

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const disconnectProperty = (id: string) => {
        // In a real application, this would be an API call to disconnect
        setProperties(properties.filter(property => property.id !== id))
    }

    const disconnectAll = () => {
        // In a real application, this would be an API call to disconnect all
        setProperties([])
    }

    const redirectToUrl = async () => {
        setLoading(true)
        const url = await axios.get(`/api/auth?userId=${USER_ID}`)
        console.log(url)
        router.push(url.data)
        setLoading(false)
    }

    if (loading) return <h1>Loading</h1>

    return (
        <Card className="mt-6 w-full" >
            <div className='p-6 flex flex-column justify-between'>
                <CardHeader className='p-0'>
                    <CardTitle className="text-2xl font-bold">Google Search Console Connections</CardTitle>
                    <CardDescription>Manage your connected Google Search Console properties</CardDescription>
                </CardHeader>
                <Button onClick={redirectToUrl}>
                    Add site
                </Button>
            </div>

            <CardContent>
                {properties.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property URL</TableHead>
                                <TableHead>Last Sync</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>{property.url}</TableCell>
                                    <TableCell>{property.lastSync}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Disconnect
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will disconnect {property.url} from your SEO dashboard. You can always reconnect later.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => disconnectProperty(property.id)}>
                                                        Disconnect
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No connected properties</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'} connected
                </p>
                {properties.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Disconnect All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will disconnect all your Google Search Console properties from your SEO dashboard. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={disconnectAll}>
                                    Yes, disconnect all
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardFooter>
        </Card>
    )
}