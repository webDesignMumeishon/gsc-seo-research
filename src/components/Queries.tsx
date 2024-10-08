import React, { useEffect, useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, RotateCcw, XIcon } from 'lucide-react'
import { webmasters_v3 } from 'googleapis'
import moment from 'moment'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from './ui/scroll-area'
import { QueryLengthFilter } from '@/enums/filters'
import MetricSorting from '@/components/atoms/MetricSorting'
import { Calendar } from "@/components/ui/calendar"
import { GetQueriesByPage } from '@/app/actions/google'
import EmptyQueries from './EmptyQueries'

const questionRegex = /^(how|why|what|when|where|who|which|can|does|do|is|are|was|will|should)\b/i


type Props = {
    site: string
    pageUrl: string
    handleBackClick: any
}

export interface query {
    clicks: number;
    ctr: number;
    impressions: number;
    keys: string[];
    position: number;
}

type DateRange = '7d' | '30d' | '90d' | 'custom'

// Define the sorting directions
export enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc',
    None = 'none',  // Default state when there's no sorting
}

// Define the fields you want to sort by
export enum SortField {
    Query = 'Query',
    Impressions = 'Impressions',
    Clicks = 'Clicks',
    Position = 'Position',
}

// Define a type for the sorting state
type SortState = {
    isEnabled: boolean
    field: SortField;
    direction: SortDirection;
};

class DateService {
    static getDaysRange(days: number) {
        const today = moment();
        const pastDate = moment().subtract(days, 'days');
        return {
            from: pastDate.format('YYYY-MM-DD'),
            to: today.format('YYYY-MM-DD'),
        };
    }
}

function convertDateIntoNumber(date: DateRange) {
    if (date === '30d') return 30
    if (date === '90d') return 90
    if (date === '7d') return 7
    return 30
}

const PageQueries = ({
    site,
    pageUrl,
    handleBackClick,
}: Props) => {
    const [queriesData, setQueriesData] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [minPosition, setMinPosition] = useState(1)
    const [maxPosition, setMaxPosition] = useState(100)
    const [dateRange, setDateRange] = useState<DateRange>('30d')
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined; } | undefined>(undefined)
    const [queryLength, setQueryLength] = useState<QueryLengthFilter>(QueryLengthFilter.All)
    const [showQuestions, setShowQuestions] = useState(false)
    const [sort, setSorting] = useState<SortState>({
        isEnabled: false,
        field: SortField.Query,
        direction: SortDirection.None
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (customDateRange?.from !== undefined && customDateRange?.to !== undefined) {
                const result = await GetQueriesByPage(site, pageUrl, moment(customDateRange?.from).format('YYYY-MM-DD') as any, moment(customDateRange?.to).format('YYYY-MM-DD') as any)
                setQueriesData(result)
            }
            else {
                const { from, to } = DateService.getDaysRange(convertDateIntoNumber(dateRange))
                const result = await GetQueriesByPage(site, pageUrl, from as any, to as any)
                setQueriesData(result)
            }
            setLoading(false)
        }
        if (dateRange !== 'custom' || (dateRange === 'custom' && customDateRange?.from !== undefined && customDateRange?.to !== undefined)) {
            fetchData()
        }
    }, [dateRange, customDateRange])


    const incrementPosition = (setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => Math.min(prev + 1, 100))
    }

    const decrementPosition = (setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => Math.max(prev - 1, 1))
    }

    const handlePositionChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<number>>
    ) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value) && value >= 1 && value <= 100) {
            setter(value)
        }
    }

    const resetFilters = () => {
        setMinPosition(1)
        setMaxPosition(100)
        setQueryLength(QueryLengthFilter.All)
        setShowQuestions(false)
        setSorting({
            isEnabled: false,
            field: SortField.Query,
            direction: SortDirection.None
        })
    }

    const filteredQueries: query[] = queriesData.filter((query: webmasters_v3.Schema$ApiDataRow) => {
        const keyword = query?.keys?.[0] ?? ''
        const position = query.position ?? 0
        const positionMatch = position >= minPosition && position <= maxPosition
        let lengthMatch = true
        if (queryLength === QueryLengthFilter.Short) {
            lengthMatch = keyword.split(' ').length <= 2
        } else if (queryLength === QueryLengthFilter.Medium) {
            lengthMatch = keyword.split(' ').length > 2 && keyword.split(' ').length <= 4
        } else if (queryLength === QueryLengthFilter.Long) {
            lengthMatch = keyword.split(' ').length > 4
        }
        const questionMatch = showQuestions ? questionRegex.test(keyword) : true
        return positionMatch && lengthMatch && questionMatch
    })

    const handleSort = (field: SortField) => {
        setSorting((prevState) => {
            // If sorting the same field, toggle direction
            if (prevState.field === field) {
                const newDirection = prevState.direction === SortDirection.Ascending ? SortDirection.Descending : SortDirection.Ascending;
                return { ...prevState, direction: newDirection, isEnabled: true };
            }
            // If it's a new field, set to ascending by default
            return { field, direction: SortDirection.Ascending, isEnabled: true };
        });
    };

    if (sort.isEnabled) {
        filteredQueries.sort((a, b) => {
            let valueA: any, valueB: any;
            switch (sort.field) {
                case SortField.Impressions:
                    valueA = a.impressions;
                    valueB = b.impressions;
                    break;
                case SortField.Clicks:
                    valueA = a.clicks;
                    valueB = b.clicks;
                    break;
                case SortField.Position:
                    valueA = a.position;
                    valueB = b.position;
                    break;
                case SortField.Query:
                default:
                    valueA = a.keys[0].toLowerCase();
                    valueB = b.keys[0].toLowerCase();
                    break;
            }

            // Apply sorting direction
            if (valueA < valueB) return sort.direction === SortDirection.Ascending ? -1 : 1;
            if (valueA > valueB) return sort.direction === SortDirection.Ascending ? 1 : -1;
            return 0;
        });
    }

    const handleDateRangeChange = (value: DateRange) => {
        setDateRange(value)
        if (value === 'custom') {
            setIsCalendarOpen(true)
            setCustomDateRange(undefined)
        }
    }

    const formatDateRange = () => {
        if (dateRange !== 'custom' || !customDateRange) {
            return dateRange
        }
        else {
            const { from, to } = customDateRange
            return `${from?.toLocaleDateString()} - ${to?.toLocaleDateString()}`
        }
    }

    if (loading) {
        return <h1>Loading</h1>
    }

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <Select value={dateRange} onValueChange={handleDateRangeChange}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select date range">
                            {formatDateRange()}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom date range</SelectItem>
                    </SelectContent>
                </Select>
                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Select Custom Date Range</DialogTitle>
                        </DialogHeader>
                        <Calendar
                            mode="range"
                            selected={customDateRange}
                            onSelect={(range: { from?: Date | undefined; to?: Date | undefined } | undefined) => {
                                if (range !== undefined) {
                                    if (range.from !== undefined && range.to === undefined) {
                                        setCustomDateRange({ from: range.from, to: undefined });
                                    }
                                    if (range.from !== undefined && range.to !== undefined) {
                                        setCustomDateRange(range as any);
                                        setIsCalendarOpen(false)
                                    }
                                }
                                else {
                                    setCustomDateRange(undefined)
                                }
                            }}
                            numberOfMonths={2}
                            className="rounded-md border"
                        />
                        <div className="flex justify-end">
                            <Button onClick={() => setIsCalendarOpen(false)}>
                                <XIcon className="mr-2 h-4 w-4" />
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <p className='text-sm'>Position between:</p>
                <div className="flex items-center">
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => decrementPosition(setMinPosition)}
                            disabled={minPosition <= 1}
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Input
                            id="minPosition"
                            type="number"
                            value={minPosition}
                            onChange={(e) => handlePositionChange(e, setMinPosition)}
                            className="w-16 text-center mx-1"
                            min={1}
                            max={100}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => incrementPosition(setMinPosition)}
                            disabled={minPosition >= maxPosition}
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className='text-sm'>and</p>
                <div className="flex items-center">
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => decrementPosition(setMaxPosition)}
                            disabled={maxPosition <= minPosition}
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Input
                            id="maxPosition"
                            type="number"
                            value={maxPosition}
                            onChange={(e) => handlePositionChange(e, setMaxPosition)}
                            className="w-16 text-center mx-1"
                            min={1}
                            max={100}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => incrementPosition(setMaxPosition)}
                            disabled={maxPosition >= 100}
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center">
                    <label htmlFor="queryLength" className="mr-2 text-sm font-medium">Query Length:</label>
                    <Select value={queryLength} onValueChange={(v) => setQueryLength(v as QueryLengthFilter)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select query length" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={QueryLengthFilter.All}>All Lengths</SelectItem>
                            <SelectItem value={QueryLengthFilter.Short}>Short (1-2 words)</SelectItem>
                            <SelectItem value={QueryLengthFilter.Medium}>Medium (3-4 words)</SelectItem>
                            <SelectItem value={QueryLengthFilter.Long}>Long (5+ words)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="show-questions"
                        checked={showQuestions}
                        onCheckedChange={setShowQuestions}
                    />
                    <Label htmlFor="show-questions">Show Questions</Label>
                    <HelpCircle className="h-4 w-4" />
                </div>
                <Button variant="outline" onClick={resetFilters}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Filters
                </Button>
            </div>
            <ScrollArea className="h-[600px] w-full">
                <Button variant="ghost" size="sm" onClick={handleBackClick} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Pages
                </Button>
                {
                    filteredQueries.length === 0 && showQuestions === true
                        ? (<EmptyQueries />)
                        : (<Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Query</TableHead>
                                    <TableHead className="text-right hover:cursor-pointer" onClick={() => handleSort(SortField.Impressions)} >
                                        <MetricSorting name={SortField.Impressions} direction={sort.direction} isEnabled={sort.isEnabled} field={sort.field} />
                                    </TableHead>
                                    <TableHead className="text-right hover:cursor-pointer" onClick={() => handleSort(SortField.Clicks)}>
                                        <MetricSorting name={SortField.Clicks} direction={sort.direction} isEnabled={sort.isEnabled} field={sort.field} />
                                    </TableHead>
                                    <TableHead className="text-right hover:cursor-pointer" onClick={() => handleSort(SortField.Position)}>
                                        <MetricSorting name={SortField.Position} direction={sort.direction} isEnabled={sort.isEnabled} field={sort.field} />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQueries.map((query: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{query.keys[0]}</TableCell>
                                        <TableCell className="text-right">{query.impressions}</TableCell>
                                        <TableCell className="text-right">{query.clicks}</TableCell>
                                        <TableCell className="text-right pr-4">{Math.round(query.position)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>)
                }

            </ScrollArea>
        </>
    )
}

export default PageQueries