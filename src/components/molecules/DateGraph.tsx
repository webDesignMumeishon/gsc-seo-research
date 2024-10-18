import React, { useMemo } from 'react'
import { DateMetrics } from "@/types/googleapi"
import { Area, AreaChart, XAxis, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
    displayData: DateMetrics[]
    handleDataPointClick: any
    tickFormatterCallback: any
    CustomTooltip: any
}

const DateGraph = ({ displayData, handleDataPointClick, tickFormatterCallback, CustomTooltip }: Props) => {

    const modifiedData = useMemo(() => {
        if (displayData.length < 2) return displayData;

        const lastIndex = displayData.length - 1;
        const secondLastIndex = lastIndex - 1;

        return displayData.map((item, index) => {
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
                    tickFormatter={tickFormatterCallback}
                />
                <Tooltip content={<CustomTooltip />} />
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
                    type="monotone"
                    dataKey="clicks"
                    stroke="#4285f4"
                    fillOpacity={0.5}
                    fill="url(#colorClick)"
                />
                <Area
                    type="monotone"
                    dataKey="clicksDotted"
                    stroke="#4285f4"
                    fillOpacity={0}
                    strokeDasharray="3 3"
                />
                <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#5e35b1"
                    fillOpacity={0.5}
                    fill="url(#colorImpressions)"
                />
                <Area
                    type="monotone"
                    dataKey="impressionsDotted"
                    stroke="#5e35b1"
                    fillOpacity={0}
                    strokeDasharray="3 3"
                />
                <Area
                    type="monotone"
                    dataKey="position"
                    stroke="#e87109"
                    fillOpacity={0.5}
                    fill="url(#colorPosition)"
                />
                <Area
                    type="monotone"
                    dataKey="positionDotted"
                    stroke="#e87109"
                    fillOpacity={0}
                    strokeDasharray="3 3"
                />
                <Area
                    type="monotone"
                    dataKey="ctr"
                    stroke="#00897b"
                    fillOpacity={1}
                    fill="url(#colorCTR)"
                />
                <Area
                    type="monotone"
                    dataKey="ctrDotted"
                    stroke="#00897b"
                    fillOpacity={0}
                    strokeDasharray="3 3"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}


export default DateGraph