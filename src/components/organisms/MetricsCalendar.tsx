import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { XIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import DateService from '@/utils/dateService'

type Props = {
    date: DateRange,
    setDate: React.Dispatch<React.SetStateAction<DateRange>>
}

type SelectDate = '7d' | '30d' | '90d' | 'custom'


const MetricsCalendar = ({ date, setDate }: Props) => {
    const [selectDate, setSelectDate] = useState<SelectDate>('30d')
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const handleDateRangeChange = (value: SelectDate) => {
        setSelectDate(value)
        if (value === '30d') {
            const range = DateService.getDaysRange(30)
            setDate(range)
        }
        else if (value === '7d') {
            const range = DateService.getDaysRange(7)
            setDate(range)
        }
        else if (value === '90d') {
            const range = DateService.getDaysRange(90)
            setDate(range)
        }
        else if (value === 'custom') {
            setIsCalendarOpen(true)
            setDate({ from: undefined, to: undefined })
        }
    }

    const handleOnSelectRange = (range: DateRange | undefined) => {
        if (range !== undefined) {
            if (range.from !== undefined && range.to === undefined) {
                setDate({ from: range.from, to: undefined })
            }
            if (range.from !== undefined && range.to !== undefined) {
                setDate({ from: range.from, to: range.to })
                setIsCalendarOpen(false)
            }
        }
        else {
            setDate({ from: undefined, to: undefined })
        }
    }

    const formatDateRange = () => {
        if (selectDate !== 'custom' || !date) {
            return selectDate
        }
        else {
            const { from, to } = date
            return `${from?.toLocaleDateString()} - ${to?.toLocaleDateString()}`
        }
    }

    return (
        <>
            <Select value={selectDate} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select date range">
                        {formatDateRange()}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom date range</SelectItem>
                </SelectContent>
            </Select>

            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <DialogContent className="w-full">
                    <DialogHeader>
                        <DialogTitle>Select Custom Date Range</DialogTitle>
                    </DialogHeader>
                    <Calendar
                        mode="range"
                        selected={date}
                        onSelect={handleOnSelectRange}
                        numberOfMonths={2}
                        className="rounded-md border p-0"
                    />
                    <div className="flex justify-end">
                        <Button onClick={() => setIsCalendarOpen(false)}>
                            <XIcon className="mr-2 h-4 w-4" />
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MetricsCalendar