import React from 'react'
import { SortDirection, SortField } from '../Queries'
import { ArrowDown, ArrowUp } from 'lucide-react'

type Props = {
    field: SortField
    name: string;
    isEnabled: boolean;
    direction: SortDirection;
}

const MetricSorting = ({ name, isEnabled, direction, field }: Props) => {
    return (
        <div className='flex justify-end'>
            {name}
            {
                isEnabled && field === name ?
                    direction === SortDirection.Ascending ? <ArrowUp size={20} /> :
                        <ArrowDown size={20} /> :
                    null
            }
        </div>
    )
}

export default MetricSorting