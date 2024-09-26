"use client"

import React, { useState } from 'react'
import axios from 'axios'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { XCircle, AlertTriangle, CirclePlus } from 'lucide-react'
import { USER_ID } from '@/utils'
import { useRouter } from 'next/navigation'
import { Sites } from '@/actions/google'
import { DeleteSite } from '@/actions/sites'
import { useSiteContext } from '@/context/SiteContext'

type Property = {
    id: string;
    url: string;
    lastSync: string;
}

type Props = {
    userSites: Sites[]
}

const ManageConnections = ({ userSites }: Props) => {
    const { removeSite } = useSiteContext();

    const [properties, setProperties] = useState<Sites[]>(userSites)
    const router = useRouter()

    const disconnectProperty = async (id: number) => {
        const siteId = await DeleteSite(id)
        setProperties(properties.filter(property => property.id !== Number(id)))
        removeSite(siteId)
    }

    const disconnectAll = () => {
        setProperties([])
    }

    const redirectToUrl = async () => {
        const url = await axios.get(`/api/auth?userId=${USER_ID}`)
        router.push(url.data)
    }

    return (
        <Card className="mt-6 w-full" >
            <div className='p-6 flex flex-column justify-between'>
                <CardHeader className='p-0'>
                    <CardTitle className="text-2xl font-bold">Google Search Console Connections</CardTitle>
                    <CardDescription>Manage your connected Google Search Console properties</CardDescription>
                </CardHeader>
                <Button onClick={redirectToUrl}>
                    <CirclePlus className="w-4 h-4 mr-2" /> Add
                </Button>
            </div>

            <CardContent>
                {properties.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property URL</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>{property.url}</TableCell>
                                    <TableCell>{property.permission}</TableCell>
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

export default ManageConnections