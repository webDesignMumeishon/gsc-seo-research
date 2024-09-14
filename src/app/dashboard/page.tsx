"use client"
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GetPagesList, GetQueriesByPage } from '@/actions/google'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ArrowLeft, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react'
import { webmasters_v3 } from 'googleapis'

interface PageQuery {
    id: number;
    page: string;
    numberOfQueries: number;
}

const Page = () => {
    const [selectedPage, setSelectedPage] = useState<number | null>(null)
    const [queriesData, setQueriesData] = useState<any>([])



    useEffect(() => {
        const fetch = async () => {
            const result = await GetPagesList();
            setpagesData(result)
        }
        fetch()
    }, [])

    const [pagesData, setpagesData] = useState<PageQuery[]>([])
    const [minPosition, setMinPosition] = useState(1)
    const [maxPosition, setMaxPosition] = useState(100)
    const [queryLength, setQueryLength] = useState('all')

    const handlePageClick = async (pageId: number, pageUrl: string) => {
        const result = await GetQueriesByPage(pageUrl)
        setQueriesData(result)
        setSelectedPage(pageId)
        console.log(result)
    }

    const handleBackClick = () => {
        setSelectedPage(null)
    }

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
        setQueryLength('all')
    }

    interface query {
        clicks: number;
        ctr: number;
        impressions: number;
        keys: string[];
        position: number;
    }

    const filteredQueries: query[] = selectedPage !== null
        ? queriesData.filter((query: webmasters_v3.Schema$ApiDataRow) => {

            const keyword = query?.keys?.[0] ?? ''
            const position = query.position ?? 0

            const positionMatch = position >= minPosition && position <= maxPosition
            let lengthMatch = true
            if (queryLength === 'short') {
                lengthMatch = keyword.split(' ').length <= 2
            } else if (queryLength === 'medium') {
                lengthMatch = keyword.split(' ').length > 2 && keyword.split(' ').length <= 4
            } else if (queryLength === 'long') {
                lengthMatch = keyword.split(' ').length > 4
            }
            return positionMatch && lengthMatch
        })
        : []


    return (
        <Card className="mt-6 mx-6 w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {selectedPage === null ? 'Pages and Queries Overview' : `Queries for ${pagesData.find(p => p.id === selectedPage)?.page}`}
                </CardTitle>
                <CardDescription>
                    {selectedPage === null ? 'Click on a page to view its queries' : 'Detailed query information for the selected page'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {selectedPage !== null && (
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                        <p className='text-sm'>Position between:</p>
                        <div className="flex items-center">
                            {/* <label htmlFor="minPosition" className="mr-2 text-sm font-medium"></label> */}
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
                            {/* <label htmlFor="maxPosition" className="mr-2 text-sm font-medium">Position:</label> */}
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
                            <Select value={queryLength} onValueChange={setQueryLength}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select query length" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Lengths</SelectItem>
                                    <SelectItem value="short">Short (1-2 words)</SelectItem>
                                    <SelectItem value="medium">Medium (3-4 words)</SelectItem>
                                    <SelectItem value="long">Long (5+ words)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" onClick={resetFilters}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset Filters
                        </Button>
                    </div>
                )}
                <ScrollArea className="h-[600px] w-full">
                    {selectedPage === null ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Page page</TableHead>
                                    <TableHead className="text-right">Query Count</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagesData.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell>{page.page}</TableCell>
                                        <TableCell className="text-right">{page.numberOfQueries}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" onClick={() => handlePageClick(page.id, page.page)}>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={handleBackClick} className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Pages
                            </Button>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Query</TableHead>
                                        <TableHead className="text-right">Impressions</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">Position</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredQueries.map((query, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{query.keys[0]}</TableCell>
                                            <TableCell className="text-right">{query.impressions}</TableCell>
                                            <TableCell className="text-right">{query.clicks}</TableCell>
                                            <TableCell className="text-right">{query.position}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default Page