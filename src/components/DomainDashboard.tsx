"use client"

import { useState, useCallback, useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { ResponsiveContainer } from "recharts"

import {
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
import ISO8601 from "@/utils/ISO8601"
import DateGraph from "./molecules/DateGraph"
import { aggregateMonthlyData } from "@/utils/metrics"
import { CategoricalChartState } from "recharts/types/chart/types"
import { GraphMetrics } from "@/types/googleapi"
import { columns } from "@/static/columns"
import { DataTable } from "./PagesTable"

type Props = {
    chartData: GraphMetrics[]
}


export default function DomainDashboard({ chartData }: Props) {
    const [isMonthly, setIsMonthly] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState<CategoricalChartState | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentNote, setCurrentNote] = useState("")

    const displayData = useMemo(
        () => isMonthly ? aggregateMonthlyData(chartData) : chartData,
        [chartData, isMonthly]
    )

    const handleDataPointClick = useCallback((data: CategoricalChartState) => {
        setSelectedPoint(data)
        setIsDialogOpen(true)
    }, [])

    const handleNoteChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setCurrentNote(e.target.value)
    }, [])

    const handleNoteSave = useCallback(() => {
        if (selectedPoint) {
            const newChartData = chartData.map(item =>
                item.date === (selectedPoint as any).date ? { ...item, note: currentNote } : item
            )
            // setChartData(newChartData)
            setIsDialogOpen(false)
        }
    }, [selectedPoint, currentNote, chartData])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-background border rounded p-4 shadow-lg">
                    <p className="font-bold">{label}</p>
                    <p>Clicks: {data.clicks}</p>
                    <p>Impressions: {data.impressions}</p>
                    <p>Position: {Math.round(data.position)}</p>
                    <p>CTR: {Math.round(data.ctr)}%</p>
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
            return date.getYearMonth()
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
                <DateGraph
                    displayData={displayData}
                    CustomTooltip={CustomTooltip}
                    handleDataPointClick={handleDataPointClick}
                    tickFormatterCallback={tickFormatter}
                />
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

            <DataTable columns={columns} data={[
                {
                    "page": "190cee9",
                    "impressions": 459,
                    "clicks": 5788,
                    "ctr": 0.55,
                    "position": 5370
                },
                {
                    "page": "1951d3e",
                    "impressions": 176,
                    "clicks": 8497,
                    "ctr": 8.45,
                    "position": 5369
                },
                {
                    "page": "4d3937b",
                    "impressions": 500,
                    "clicks": 7839,
                    "ctr": 3.07,
                    "position": 3635
                },
                {
                    "page": "5cb31fb",
                    "impressions": 272,
                    "clicks": 6522,
                    "ctr": 8.67,
                    "position": 4026
                },
                {
                    "page": "32a9b65",
                    "impressions": 150,
                    "clicks": 4209,
                    "ctr": 8.93,
                    "position": 243
                },
                {
                    "page": "3ae3a6d",
                    "impressions": 209,
                    "clicks": 5196,
                    "ctr": 2.2,
                    "position": 6733
                },
                {
                    "page": "327173e",
                    "impressions": 774,
                    "clicks": 7548,
                    "ctr": 8.89,
                    "position": 9895
                },
                {
                    "page": "347ba67",
                    "impressions": 882,
                    "clicks": 1492,
                    "ctr": 8.5,
                    "position": 9792
                },
                {
                    "page": "4910e0a",
                    "impressions": 235,
                    "clicks": 3010,
                    "ctr": 8.68,
                    "position": 523
                },
                {
                    "page": "c6762c",
                    "impressions": 693,
                    "clicks": 9605,
                    "ctr": 1.47,
                    "position": 1258
                },
                {
                    "page": "42eab23",
                    "impressions": 330,
                    "clicks": 1990,
                    "ctr": 3.75,
                    "position": 3805
                },
                {
                    "page": "26fbe92",
                    "impressions": 164,
                    "clicks": 3130,
                    "ctr": 4.31,
                    "position": 2909
                }
            ]} />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add/Edit Note for XXXXXXX</DialogTitle>
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