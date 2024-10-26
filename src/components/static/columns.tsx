import PageTHeaderColumn from "@/components/atoms/PageTHeaderColumn"
import { PageMetrics, QueryMetrics } from "@/types/googleapi"
import { ColumnDef } from "@tanstack/react-table"





export const columns: ColumnDef<PageMetrics>[] = [
    {
        accessorKey: "page",
        header: () => <div>Pages</div>,
        cell: (cell) => {
            return (
                <div className="relative p-1">
                    <p className="cursor-pointer">
                        {new URL(cell.getValue<string>()).pathname}
                    </p>
                </div>

            )
        },
    },
    {
        accessorKey: "impressions",
        header: ({ column }) => {
            return <PageTHeaderColumn<PageMetrics> column={column} metric={<p className="text-impressions">Impressions</p>} />
        }
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return <PageTHeaderColumn<PageMetrics> column={column} metric={<p className="text-clicks">Clicks</p>} />
        }
    },
    {
        accessorKey: "ctr",
        header: ({ column }) => {
            return <PageTHeaderColumn<PageMetrics> column={column} metric={<p className="text-ctr">CTR</p>} />
        }
    },
    {
        accessorKey: "position",
        header: ({ column }) => {
            return <PageTHeaderColumn<PageMetrics> column={column} metric={<p className="text-position">Position</p>} />
        }
    },
    // {
    //     accessorKey: "menu",
    //     header: () => <Settings className="h-4 w-4 align-middle" />,
    //     cell: ({ row }) => {
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => navigator.clipboard.writeText(JSON.stringify(row))}
    //                     >
    //                         Copy payment ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem>View customer</DropdownMenuItem>
    //                     <DropdownMenuItem>View payment details</DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
]

export const queryColumns: ColumnDef<QueryMetrics>[] = [
    {
        accessorKey: "query",
        header: () => <div>Query</div>,
        cell: (cell) => {
            return (
                <div className="relative p-1">
                    <p>
                        {cell.getValue<string>()}
                    </p>
                </div>

            )
        },
    },
    {
        accessorKey: "impressions",
        header: ({ column }) => {
            return <PageTHeaderColumn<QueryMetrics> column={column} metric={<p className="text-impressions">Impressions</p>} />
        }
    },
    {
        accessorKey: "clicks",
        header: ({ column }) => {
            return <PageTHeaderColumn<QueryMetrics> column={column} metric={<p className="text-clicks">Clicks</p>} />
        }
    },
    {
        accessorKey: "ctr",
        header: ({ column }) => {
            return <PageTHeaderColumn<QueryMetrics> column={column} metric={<p className="text-ctr">CTR</p>} />
        }
    },
    {
        accessorKey: "position",
        header: ({ column }) => {
            return <PageTHeaderColumn<QueryMetrics> column={column} metric={<p className="text-position">Position</p>} />
        }
    },
    // {
    //     accessorKey: "menu",
    //     header: () => <Settings className="h-4 w-4 align-middle" />,
    //     cell: ({ row }) => {
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => navigator.clipboard.writeText(JSON.stringify(row))}
    //                     >
    //                         Copy payment ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem>View customer</DropdownMenuItem>
    //                     <DropdownMenuItem>View payment details</DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
]