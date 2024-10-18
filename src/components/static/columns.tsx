import PageTHeaderColumn from "@/components/atoms/PageTHeaderColumn"
import { PageMetrics } from "@/types/googleapi"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<PageMetrics>[] = [
    {
        accessorKey: "page",
        header: () => <div>Pages</div>,
    },
    {
        accessorKey: "impressions",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-impressions">Impressions</p>} />
        }
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-clicks">Clicks</p>} />
        }
    },
    {
        accessorKey: "ctr",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-ctr">CTR</p>} />
        }
    },
    {
        accessorKey: "position",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-position">Position</p>} />
        }
    },
    {
        accessorKey: "menu",
        header: () => <Settings className="h-4 w-4 align-middle" />,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(row))}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export const queryColumns: ColumnDef<PageMetrics>[] = [
    {
        accessorKey: "query",
        header: () => <div>Query</div>,
    },
    {
        accessorKey: "impressions",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-impressions">Impressions</p>} />
        }
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-clicks">Clicks</p>} />
        }
    },
    {
        accessorKey: "ctr",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-ctr">CTR</p>} />
        }
    },
    {
        accessorKey: "position",
        header: ({ column }) => {
            return <PageTHeaderColumn column={column} metric={<p className="text-position">Position</p>} />
        }
    },
    {
        accessorKey: "menu",
        header: () => <Settings className="h-4 w-4 align-middle" />,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(row))}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]