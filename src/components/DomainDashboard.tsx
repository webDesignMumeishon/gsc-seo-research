"use client"
import { useState, useCallback, useMemo, useEffect } from "react"
import moment from "moment"
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
import ISO8601 from "@/utils/ISO8601"
import DateGraph from "./molecules/DateGraph"
import { aggregateMonthlyData } from "@/utils/metrics"
import { CategoricalChartState } from "recharts/types/chart/types"
import { DateMetrics, PageMetrics, QueryMetrics } from "@/types/googleapi"
import { columns, queryColumns } from "@/components/static/columns"
import { DataTable } from "./PagesTable"
import { DateRange } from "react-day-picker"
import MetricsCalendar from "./organisms/MetricsCalendar"
import { useSiteContext } from "@/context/SiteContext"
import SearchConsoleApi from "@/services/search-console-api"

type Props = {
    url: string
}


export default function DomainDashboard({ url }: Props) {
    const { userIdClerk } = useSiteContext();

    // Pages
    const [pageData, setPageData] = useState<PageMetrics[]>([])
    const [comparePageData, setComparePageData] = useState<PageMetrics[]>([])
    const [compareQueryData, setCompareQueryData] = useState<QueryMetrics[]>([])

    const [dateData, setDateData] = useState<DateMetrics[]>([])
    const [queryData, setQueryData] = useState<QueryMetrics[]>([])

    const [isMonthly, setIsMonthly] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState<CategoricalChartState | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentNote, setCurrentNote] = useState("")
    const [dateRange, setDateRange] = useState<DateRange>({ from: moment().subtract(260, 'days').toDate(), to: moment().toDate() })

    const handleDataPointClick = useCallback((data: CategoricalChartState) => {
        setSelectedPoint(data)
        setIsDialogOpen(true)
    }, [])

    const handleNoteChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        setCurrentNote(e.target.value)
    }, [])

    const handleNoteSave = useCallback(() => {
        if (selectedPoint) {
            // const newChartData = dateData.map(item =>
            //     item.date === (selectedPoint as any).date ? { ...item, note: currentNote } : item
            // )
            // setChartData(newChartData)
            setIsDialogOpen(false)
        }
    }, [selectedPoint, currentNote])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-background border rounded p-4 shadow-lg">
                    <p className="font-bold">{label}</p>
                    <p>Clicks: {data.clicks !== null ? data.clicks : data.clicksDotted}</p>
                    <p>Impressions:{data.impressions !== null ? data.impressions : data.impressionsDotted}</p>
                    <p>Position: {data.position !== null ? Math.round(data.position) : Math.round(data.positionDotted)} { }</p>
                    <p>CTR: {data.ctr !== null ? Math.round(data.ctr) : Math.round(data.ctrDotted)}% </p>
                    {data.note && <p className="mt-2">Note: {data.note}</p>}
                    <p className="mt-2 text-sm text-muted-foreground">Click to add/edit note</p>
                </div>
            )
        }
        return null
    }

    const fetchData = useCallback(async (startDate: Date, endDate: Date) => {
        SearchConsoleApi.pagesMetrics(userIdClerk, startDate, endDate, url).then(pagesMetrics => { setPageData(pagesMetrics) })
        SearchConsoleApi.dateMetrics(userIdClerk, startDate, endDate, url).then(dateMetrics => { setDateData(dateMetrics) })
        SearchConsoleApi.queriesMetrics(userIdClerk, startDate, endDate, url).then(queryMetrics => { setQueryData(queryMetrics) })

        Promise.all([
            SearchConsoleApi.pagesMetrics(userIdClerk, moment(startDate).subtract(30, 'day').toDate(), moment(endDate).subtract(30, 'day').toDate(), url),
            SearchConsoleApi.queriesMetrics(userIdClerk, moment(startDate).subtract(30, 'day').toDate(), moment(endDate).subtract(30, 'day').toDate(), url),
        ]).then(results => {
            const [pagesMetrics, queryMetrics] = results
            setComparePageData(pagesMetrics)
            setCompareQueryData(queryMetrics)
        })

    }, []);

    useEffect(() => {
        if (dateRange.from !== undefined && dateRange.to !== undefined) {
            fetchData(dateRange.from, dateRange.to)
        }
    }, [dateRange])

    return (
        <div>
            <CardContent>
                <MetricsCalendar date={dateRange} setDate={setDateRange} />
                <DateGraph
                    data={dateData}
                    CustomTooltip={CustomTooltip}
                    handleDataPointClick={handleDataPointClick}
                    isMonthly={isMonthly}
                />
            </CardContent>

            <div className="flex gap-6 justify-between bg-inherit items-start">
                <DataTable<PageMetrics, PageMetrics> columns={columns} data={pageData} compareData={comparePageData} dataName='page'/>
                <DataTable<QueryMetrics, QueryMetrics> columns={queryColumns} data={queryData} compareData={compareQueryData} dataName='query' />
            </div>


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