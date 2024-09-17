"use client"
import { webmasters_v3 } from 'googleapis'
import React, { useEffect, useState } from 'react'
import { ChevronRight, ArrowLeft, ChevronUp, ChevronDown, RotateCcw, Globe, Search, FileText, HelpCircle } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GetPagesListCache, GetQueriesByPage } from '@/actions/google'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSiteContext } from '@/context/SiteContext'
import NoKeywordsData from '@/components/NoKeywordsData'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
interface PageQuery {
    id: number;
    page: string;
    numberOfQueries: number;
}

const Page = () => {
    const [selectedPage, setSelectedPage] = useState<number | null>(null)
    const [queriesData, setQueriesData] = useState<any>([])
    const { selectedSite, loading } = useSiteContext();
    const [pagesData, setpagesData] = useState<PageQuery[]>([])
    const [minPosition, setMinPosition] = useState(1)
    const [maxPosition, setMaxPosition] = useState(100)
    const [queryLength, setQueryLength] = useState('all')
    const [showQuestions, setShowQuestions] = useState(true)

    const questionRegex = /^(how|why|what|when|where|who|which|can|does|do|is|are|was|will|should)\b/i

    useEffect(() => {
        const fetch = async (page: string) => {
            const result = await GetPagesListCache(page);
            setpagesData(result)
        }

        if (selectedSite !== null && selectedSite !== undefined) {
            setSelectedPage(null)
            fetch(selectedSite.name)
        }
    }, [selectedSite])



    const handlePageClick = async (pageId: number, pageUrl: string) => {
        if (selectedSite?.name !== undefined) {
            const result = await GetQueriesByPage(selectedSite?.name, pageUrl)
            setQueriesData(result)
            setSelectedPage(pageId)
        }
        else {
            throw new Error('Site does not exist')
        }
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
        setShowQuestions(false)
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
            const questionMatch = showQuestions ? questionRegex.test(keyword) : true
            return positionMatch && lengthMatch && questionMatch
        })
        : []

    if (loading) {
        return <h1>Loading</h1>
    }

    if (pagesData.length === 0) {
        return <NoKeywordsData />
    }

    return (
        <Card className="mt-6 mx-6">
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