import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { ReactNode } from "react"
import { Column } from "@tanstack/react-table"


interface PageTHeaderColumnProps<T> {
    column: Column<T, unknown>;
    metric: ReactNode;
}

const PageTHeaderColumn = <T,>({ column, metric }: PageTHeaderColumnProps<T>) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 p-0">
                    <div className="flex items-center">
                        {metric}
                        <ChevronsUpDown className="h-4 w-4" />
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                    <ArrowUp className="h-4 w-4 text-slate-400 mr-2 cursor-pointer" /> ASC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                    <ArrowDown className="h-4 w-4 text-slate-400 mr-2 cursor-pointer" /> DESC
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PageTHeaderColumn