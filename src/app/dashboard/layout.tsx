import React from 'react'

import Sidebar from '@/components/Sidebar';
import { GetUserToken } from '@/actions/token';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react'


export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const token = await GetUserToken(3);

    if (token !== null) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 items-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Google Search Console</CardTitle>
                        {false ? (
                            <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Connected
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                                <XCircle className="w-4 h-4 mr-1" />
                                Not Connected
                            </Badge>
                        )}
                    </div>
                    <CardDescription>
                        {false
                            ? "Your Google Search Console account is linked."
                            : "Connect your Google Search Console to import your search data."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {false ? (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                You&apos;re currently importing data from the following properties:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                <li>https://www.example.com</li>
                                <li>https://blog.example.com</li>
                            </ul>
                            <p className="text-sm text-gray-600">
                                Last sync: <span className="font-medium">2 hours ago</span>
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Connecting to Google Search Console allows you to:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                <li>Import your search performance data</li>
                                <li>Track your website&apos;s visibility in Google Search results</li>
                                <li>Identify top-performing pages and queries</li>
                            </ul>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        // onClick={toggleConnection}
                        className={`w-full ${false ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {false ? (
                            <>
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Disconnect
                            </>
                        ) : (
                            <>
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Connect to Google Search Console
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )

}


