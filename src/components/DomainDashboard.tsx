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
import GraphMetricsHook from "@/hooks/GrapMetricsHook"
import { CategoricalChartState } from "recharts/types/chart/types"

type Props = {
    url: string
}


export default function DomainDashboard({ url }: Props) {
    const { chartData, setChartData } = GraphMetricsHook(url)

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
                item.date === (selectedPoint as any).date  ? { ...item, note: currentNote } : item
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
                <ResponsiveContainer width="100%" height={400}>
                    <DateGraph
                        displayData={displayData}
                        CustomTooltip={CustomTooltip}
                        handleDataPointClick={handleDataPointClick}
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