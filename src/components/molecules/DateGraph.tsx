import React, { useMemo } from 'react'
import { DateMetrics } from "@/types/googleapi"
import { Area, AreaChart, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis, Line, CartesianAxis } from "recharts"
import ISO8601 from '@/utils/ISO8601'
import { YYYYMMDD } from '@/utils/dateService'

type Props = {
    displayData: DateMetrics[]
    handleDataPointClick: any
    isMonthly: boolean
    CustomTooltip: any
}

const fillOpacityValue = 0.5
const strokeWidthValue = 1.5
const fillOpacityDottedValue = 0

const DateGraph = ({ displayData, handleDataPointClick, CustomTooltip, isMonthly }: Props) => {
    
    const modifiedData = useMemo(() => {
        if (displayData.length < 2) return displayData;

        const lastIndex = displayData.length - 1;
        const secondLastIndex = lastIndex - 1;

        return displayData.map((item: any, index: any) => {
            if (index === lastIndex) {
                return {
                    ...item,
                    clicksDotted: item.clicks,
                    impressionsDotted: item.impressions,
                    positionDotted: item.position,
                    ctrDotted: item.ctr,
                    clicks: null,
                    impressions: null,
                    position: null,
                    ctr: null
                };
            }
            else if (index === secondLastIndex) {
                return {
                    ...item,
                    clicksDotted: item.clicks,
                    impressionsDotted: item.impressions,
                    positionDotted: item.position,
                    ctrDotted: item.ctr,
                    clicks: item.clicks,
                    impressions: item.impressions,
                    position: item.position,
                    ctr: item.ctr
                };
            }
            return item;
        });
    }, [displayData]);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart
                data={modifiedData}
                margin={{
                    top: 50,
                    right: 50,
                    left: 50,
                    bottom: 0,
                }}
                onClick={handleDataPointClick}
            >
                <XAxis
                    dataKey="date"
                    tickFormatter={(value: YYYYMMDD): string => {
                        const date = new ISO8601(value)
                        if (isMonthly) {
                            return date.getYearMonth()
                        }
                        return date.getMonthDay()
                    }}
                    tickLine={true}
                    minTickGap={25}
                />

                <Tooltip content={<CustomTooltip />} />

                <YAxis
                    dataKey="position"
                />

                <defs>
                    <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4285f4" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#4285f4" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5e35b1" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#5e35b1" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="colorPosition" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="1%" stopColor="#e87109" stopOpacity={0.5} />
                        <stop offset="99%" stopColor="#e87109" stopOpacity={0.1} />
                    </linearGradient>

                    <linearGradient id="colorCTR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00897b" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#00897b" stopOpacity={0.1} />
                    </linearGradient>

                </defs>
                <Area
                    type="linear"
                    dataKey="clicks"
                    stroke="#4285f4"
                    fillOpacity={fillOpacityValue}
                    strokeWidth={strokeWidthValue}
                    fill="url(#colorClick)"
                    connectNulls={true}
                />
                <Area
                    type="linear"
                    dataKey="clicksDotted"
                    stroke="#4285f4"
                    fillOpacity={fillOpacityDottedValue}
                    strokeDasharray="3 3"
                />
                <Area
                    type="linear"
                    dataKey="impressions"
                    stroke="#5e35b1"
                    strokeLinecap='round'
                    strokeWidth={strokeWidthValue}
                    fillOpacity={fillOpacityValue}
                    fill="url(#colorImpressions)"
                />
                <Area
                    type="linear"
                    dataKey="impressionsDotted"
                    stroke="#5e35b1"
                    fillOpacity={fillOpacityDottedValue}
                    strokeDasharray="3 3"
                />
                <Area
                    type="linear"
                    dataKey="position"
                    stroke="#e87109"
                    strokeWidth={strokeWidthValue}
                    fillOpacity={fillOpacityValue}
                    fill="url(#colorPosition)"
                />
                <Area
                    type="linear"
                    dataKey="positionDotted"
                    stroke="#e87109"
                    fillOpacity={fillOpacityDottedValue}
                    strokeDasharray="3 3"
                />
                <Area
                    type="linear"
                    dataKey="ctr"
                    stroke="#00897b"
                    strokeWidth={strokeWidthValue}
                    fillOpacity={fillOpacityValue}
                    fill="url(#colorCTR)"
                />
                <Area
                    type="linear"
                    dataKey="ctrDotted"
                    stroke="#00897b"
                    fillOpacity={fillOpacityDottedValue}
                    strokeDasharray="3 3"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}


export default DateGraph