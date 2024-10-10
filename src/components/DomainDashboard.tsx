"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { GetSiteMetrics } from "@/app/actions/google"
import { useSiteContext } from "@/context/SiteContext"
import ISO8601 from "@/utils/ISO8601"
import DateGraph from "./molecules/DateGraph"

// Generate 365 days of data
const generateDailyData = () => {
    const data = []
    const startDate = new Date(2024, 0, 1) // Start from January 1, 2024
    for (let i = 0; i < 365; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        data.push({
            date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            desktop: Math.floor(Math.random() * 300) + 50,
            mobile: Math.floor(Math.random() * 200) + 30,
            note: "", // Initialize empty note for each day
        })
    }
    return data
}

const aggregateMonthlyData = (dailyData) => {
    const monthlyData = dailyData.reduce((acc, curr) => {
        const month = new ISO8601(curr.date).getYearMonth()
        if (!acc[month]) {
            acc[month] = { ctr: 0, impressions: 0, position: 0, clicks: 0 }
        }
        acc[month].ctr += curr.ctr
        acc[month].impressions += curr.impressions
        acc[month].position += curr.position
        acc[month].clicks += curr.clicks
        return acc
    }, {})

    const monthsCount = Object.keys(monthlyData).length

    return Object.entries(monthlyData).map(([date, data]) => ({
        date,
        ctr: Math.round(data.ctr / monthsCount),
        impressions: data.impressions,
        position: Math.round(data.position / monthsCount),
        clicks: data.clicks,
    }))
}

type Props = {
    url: string
}


export default function DomainDashboard({ url }: Props) {
    const { selectedSite, userIdClerk } = useSiteContext();

    const [isMonthly, setIsMonthly] = useState(false)
    const [chartData, setChartData] = useState<any[]>(generateDailyData())
    const [selectedPoint, setSelectedPoint] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentNote, setCurrentNote] = useState("")


    useEffect(() => {
        const fetchData = async () => {
            const r = await GetSiteMetrics(userIdClerk, url)
            setChartData(r)
        }
        fetchData()
    }, [])

    const displayData = useMemo(
        () => isMonthly ? aggregateMonthlyData(chartData) : chartData,
        [chartData, isMonthly]
    )

    console.log(displayData)


    const handleDataPointClick = useCallback((data) => {
        console.log(data)
        setSelectedPoint(data)
        setCurrentNote(data.note)
        setIsDialogOpen(true)
    }, [])

    const handleNoteChange = useCallback((e) => {
        setCurrentNote(e.target.value)
    }, [])

    const handleNoteSave = useCallback(() => {
        if (selectedPoint) {
            const newChartData = chartData.map(item =>
                item.date === selectedPoint.date ? { ...item, note: currentNote } : item
            )
            setChartData(newChartData)
            setIsDialogOpen(false)
        }
    }, [selectedPoint, currentNote, chartData])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-background border rounded p-4 shadow-lg">
                    <p className="font-bold">{label}</p>
                    <p>Desktop: {data.impressions}</p>
                    <p>Mobile: {data.mobile}</p>
                    {data.note && <p className="mt-2">Note: {data.note}</p>}
                    <p className="mt-2 text-sm text-muted-foreground">Click to add/edit note</p>
                </div>
            )
        }
        return null
    }

    const tickFormatter = (value: string) => {
        const date = new ISO8601(value)
        if (isMonthly) {
            return new Error('implement monthly')
        }
        return date.getDay()
    }

    return (
        <div className="w-full">
            <CardHeader>
                <CardTitle>Area Chart - {isMonthly ? "Monthly" : "Daily"} Gradient with Notes</CardTitle>
                <CardDescription>
                    Showing total visitors for the year 2024. Click on a data point to add or edit a note.
                </CardDescription>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="view-mode"
                        checked={isMonthly}
                        onCheckedChange={setIsMonthly}
                    />
                    <Label htmlFor="view-mode">
                        {isMonthly ? "Monthly View" : "Daily View"}
                    </Label>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <DateGraph
                        displayData={displayData}
                        CustomTooltip={CustomTooltip}
                        handleDataPointClick={handleDataPointClick}
                        interval={isMonthly ? 1 : 2}
                        tickFormatterCallback={tickFormatter}
                    />
                </ResponsiveContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 3.8% this year <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Year 2024 data
                        </div>
                    </div>
                </div>
            </CardFooter>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add/Edit Note for {selectedPoint?.date}</DialogTitle>
                        <DialogDescription>
                            Enter your note for this date. This will be displayed when hovering over the data point.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="note" className="text-right">
                                Note
                            </Label>
                            <Input
                                id="note"
                                value={currentNote}
                                onChange={handleNoteChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleNoteSave}>Save Note</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}