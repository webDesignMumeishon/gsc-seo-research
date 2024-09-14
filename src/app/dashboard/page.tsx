"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { UserCircle, Search, BarChart2, Settings, HelpCircle } from 'lucide-react'

const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
]



const Page = () => {

    const connectToGSC = async () => {
        try {
            const response = await axios.get('/api/auth?userId=3');
            if (response.data) {
                setConnected(true)
            }
            window.location.href = response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const [connected, setConnected] = useState<boolean>(false)
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Dashboard
                    </h2>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <UserCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Google Search Console Connection */}
                    {
                        !connected && (
                            <Card className="mb-6">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Connect to Google Search Console</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Link your Google Search Console account to import your search data.
                                            </p>
                                        </div>
                                        <Button onClick={connectToGSC} className="bg-blue-600 hover:bg-blue-700">
                                            Connect
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }


                    {/* Metrics */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">45,231</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
                                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12.3</div>
                                <p className="text-xs text-muted-foreground">-2.5 from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234,567</div>
                                <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Search Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                    <span className="text-sm text-gray-600">New keyword ranked on page 1: "best SEO practices"</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="text-sm text-gray-600">Backlink gained from example.com</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                    <span className="text-sm text-gray-600">Crawl errors detected on 3 pages</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default Page