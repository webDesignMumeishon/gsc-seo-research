import React from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'

type Props = {
    pagesData: any[]
    handlePageClick: any
}

const ListPages = ({ pagesData, handlePageClick }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='text-accent'>Page page</TableHead>
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
    )
}

export default ListPages