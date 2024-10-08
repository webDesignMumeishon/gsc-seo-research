"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GetQueries } from '@/app/actions/google'
import { useSiteContext } from '@/context/SiteContext'

// Types
type DataPoint = {
    month: string;
    impressions: number;
    clicks: number;
}

type QueryData = {
    [key: string]: DataPoint[];
}

// Mock data
const overallData: DataPoint[] = [
    { month: 'Jan 2023', impressions: 10000, clicks: 500 },
    { month: 'Feb 2023', impressions: 12000, clicks: 600 },
    { month: 'Mar 2023', impressions: 15000, clicks: 750 },
    { month: 'Apr 2023', impressions: 13000, clicks: 650 },
    { month: 'May 2023', impressions: 16000, clicks: 800 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
    { month: 'Jun 2023', impressions: 18000, clicks: 900 },
]

const queryData: QueryData = {
    'roofing services': [
        { month: 'Jan 2023', impressions: 2000, clicks: 100 },
        { month: 'Feb 2023', impressions: 2200, clicks: 110 },
        { month: 'Mar 2023', impressions: 2500, clicks: 125 },
        { month: 'Apr 2023', impressions: 2300, clicks: 115 },
        { month: 'May 2023', impressions: 2600, clicks: 130 },
        { month: 'Jun 2023', impressions: 2800, clicks: 140 },
    ],
    'roof repair': [
        { month: 'Jan 2023', impressions: 1500, clicks: 75 },
        { month: 'Feb 2023', impressions: 1700, clicks: 85 },
        { month: 'Mar 2023', impressions: 2000, clicks: 100 },
        { month: 'Apr 2023', impressions: 1800, clicks: 90 },
        { month: 'May 2023', impressions: 2100, clicks: 105 },
        { month: 'Jun 2023', impressions: 2300, clicks: 115 },
    ],
    'emergency roofing': [
        { month: 'Jan 2023', impressions: 500, clicks: 25 },
        { month: 'Feb 2023', impressions: 600, clicks: 30 },
        { month: 'Mar 2023', impressions: 750, clicks: 37 },
        { month: 'Apr 2023', impressions: 650, clicks: 32 },
        { month: 'May 2023', impressions: 800, clicks: 40 },
        { month: 'Jun 2023', impressions: 900, clicks: 45 },
    ],
}

export default function MonthlySummary() {
    const { sites, selectedSite, loading } = useSiteContext();
    const [selectedQuery, setSelectedQuery] = useState<string>('overall')
    const [overallData, setOverallData] = useState<DataPoint[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if (selectedSite?.name !== undefined) {
                const queries = await GetQueries(3, selectedSite?.name)
                setOverallData(queries)
            }
        }
        fetchData()
    }, [selectedSite])

    const chartData = useMemo(() => {
        return selectedQuery === 'overall' ? overallData : (queryData[selectedQuery] || [])
    }, [selectedQuery, overallData, selectedSite])

    const allQueries = useMemo(() => ['overall', ...Object.keys(queryData)], [])

    const comprehensiveTableData = useMemo(() => {
        return overallData.map(item => {
            const row: { [key: string]: string | number } = { month: item.month }
            allQueries.forEach(query => {
                const queryDataArray = query === 'overall' ? overallData : queryData[query]
                const monthData = queryDataArray.find(d => d.month === item.month)
                if (monthData) {
                    row[`${query}_impressions`] = monthData.impressions
                    row[`${query}_clicks`] = monthData.clicks
                } else {
                    row[`${query}_impressions`] = 0
                    row[`${query}_clicks`] = 0
                }
            })
            return row
        })
    }, [allQueries])

    if (!chartData.length) {
        return <div>No data available for the selected query.</div>
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Monthly Performance Summary</CardTitle>
                <CardDescription>Impressions and clicks summary by month</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="chart" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="chart">Chart</TabsTrigger>
                        <TabsTrigger value="table">Table</TabsTrigger>
                        <TabsTrigger value="comprehensive">Comprehensive Table</TabsTrigger>
                    </TabsList>
                    <div className="mb-4">
                        <Select value={selectedQuery} onValueChange={setSelectedQuery}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select query" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overall">Overall</SelectItem>
                                {Object.keys(queryData).map(query => (
                                    <SelectItem key={query} value={query}>{query}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <TabsContent value="chart" className="space-y-4">
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
                                    <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                    <TabsContent value="table">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-right">Impressions</TableHead>
                                    <TableHead className="text-right">Clicks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chartData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.month}</TableCell>
                                        <TableCell className="text-right">{item.impressions.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{item.clicks.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="comprehensive">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        {allQueries.map(query => (
                                            <React.Fragment key={query}>
                                                <TableHead className="text-right">{query} Impressions</TableHead>
                                                <TableHead className="text-right">{query} Clicks</TableHead>
                                            </React.Fragment>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comprehensiveTableData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.month}</TableCell>
                                            {allQueries.map(query => (
                                                <React.Fragment key={query}>
                                                    <TableCell className="text-right">{(item[`${query}_impressions`] as number).toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">{(item[`${query}_clicks`] as number).toLocaleString()}</TableCell>
                                                </React.Fragment>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}