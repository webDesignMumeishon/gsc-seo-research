import React, { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, RotateCcw, Search } from 'lucide-react'
import { webmasters_v3 } from 'googleapis'

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from './ui/scroll-area'
import { QueryLengthFilter } from '@/enums/filters'

type Props = {
    queriesData: any[]
    handleBackClick: any
}

interface query {
    clicks: number;
    ctr: number;
    impressions: number;
    keys: string[];
    position: number;
}

// Define the sorting directions
enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc',
    None = 'none',  // Default state when there's no sorting
}

// Define the fields you want to sort by
enum SortField {
    Query = 'query',
    Impressions = 'impressions',
    Clicks = 'clicks',
    Position = 'position',
}

// Define a type for the sorting state
type SortState = {
    isEnabled: boolean
    field: SortField;
    direction: SortDirection;
};

const PageQueries = ({
    queriesData,
    handleBackClick,
}: Props) => {
    const [minPosition, setMinPosition] = useState(1)
    const [maxPosition, setMaxPosition] = useState(100)
    const [queryLength, setQueryLength] = useState<QueryLengthFilter>(QueryLengthFilter.All)
    const [showQuestions, setShowQuestions] = useState(false)
    const [sort, setSorting] = useState<SortState>({
        isEnabled: false,
        field: SortField.Query,
        direction: SortDirection.None
    })

    const questionRegex = /^(how|why|what|when|where|who|which|can|does|do|is|are|was|will|should)\b/i

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

    const EmptyQueries = () => {
        return (<div className="flex flex-col items-center justify-center text-gray-500">
            <Search className="h-8 w-8 mb-2" />
            <p className="text-lg font-medium">No queries found</p>
            <p className="text-sm">Try adjusting your filters to see more results</p>
        </div>)
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

            // Determine the field to sort by
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
        console.log('After', filteredQueries)
    }





    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-4">
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
                                    <TableHead className="text-right" onClick={() => handleSort(SortField.Impressions)}>Impressions</TableHead>
                                    <TableHead className="text-right" onClick={() => handleSort(SortField.Clicks)}>Clicks</TableHead>
                                    <TableHead className="text-right" onClick={() => handleSort(SortField.Position)}>Position</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQueries.map((query: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{query.keys[0]}</TableCell>
                                        <TableCell className="text-right">{query.impressions}</TableCell>
                                        <TableCell className="text-right">{query.clicks}</TableCell>
                                        <TableCell className="text-right">{query.position}</TableCell>
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