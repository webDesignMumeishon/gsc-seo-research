import { Search } from 'lucide-react'
import React from 'react'

const EmptyQueries = () => {
    return (
        <div className="flex flex-col items-center justify-center text-gray-500">
            <Search className="h-8 w-8 mb-2" />
            <p className="text-lg font-medium">No queries found</p>
            <p className="text-sm">Try adjusting your filters to see more results</p>
        </div>
    )
}

export default EmptyQueries