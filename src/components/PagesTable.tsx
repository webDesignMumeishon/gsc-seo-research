"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { Dimension, GoogleMetrics, PageMetrics } from "@/types/googleapi"
import PercentageChange from "./molecules/PercentageChange"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    compareData: TData[]
    dimensionName: Dimension
}

export function DataTable<TData, TValue>({ columns, data, compareData, dimensionName }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [show, setShow] = useState(false)


    const getWidthPercentage = (field: keyof GoogleMetrics, cell: any) => {
        const max = data.reduce((prev, current) => {
            if (prev && current && prev[field] !== null && current[field] !== null) {
                return current[field] > prev[field] ? current : prev;
            }
            return prev
        }, data[0]);

        const maxFieldAmount = max?.[field] || 0

        return (Math.round((cell.row.original[field] / maxFieldAmount) * 100) || '1') + '%'
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div className="rounded-md bg-slate-50 p-2 flex-1">
            <div className="h-[650px]">
                <Table >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-none">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            {header.id === 'query' && <p onClick={() => setShow(!show)}>test</p>}

                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="border-none">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-none"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {(cell.column.id === 'page' || cell.column.id === 'query') && sorting.length > 0
                                                ?
                                                (
                                                    <div className="relative">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        <div
                                                            className="absolute top-0 left-0 h-full rounded-sm bg-clicks/10"
                                                            style={{ width: `${getWidthPercentage(sorting[0].id as keyof GoogleMetrics, cell)}` }}
                                                        >
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (cell.column.id === 'page' || cell.column.id === 'query')
                                                    ? flexRender(cell.column.columnDef.cell, cell.getContext())
                                                    : <div className="flex justify-around items-center">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        <PercentageChange<TData>
                                                            currentMetricValue={cell.getValue<number>()}
                                                            metricColumn={cell.column.id as keyof TData}
                                                            oldData={compareData.find(row => row?.[dimensionName as keyof TData] === dimensionName)}
                                                        />
                                                    </div>
                                            }


                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-end justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
