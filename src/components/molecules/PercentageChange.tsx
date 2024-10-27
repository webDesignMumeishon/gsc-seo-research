import React from 'react'
import { Minus, MoveDown, MoveUp } from "lucide-react"

type Props<T> = {
    currentMetricValue: number
    metricColumn: keyof T
    oldData: T | undefined
}

const PercentageChange = <T,>({ currentMetricValue, metricColumn, oldData }: Props<T>) => {
    // Ensure `oldDataMetricValue` is either the value from oldData or defaults to 0 if undefined
    const oldDataMetricValue = oldData?.[metricColumn] as number | undefined ?? 0;

    if (metricColumn === 'position') {

        if (currentMetricValue > 0 && oldDataMetricValue > 0) {
            const improvement = oldDataMetricValue - currentMetricValue
            const percentageImproved = Math.round((improvement / oldDataMetricValue) * 100)
            if (percentageImproved > 0) {
                return <div className="flex items-center">
                    <MoveUp size={10} className="text-green-800 text-[12px]" />
                    <span className="text-[#006c35] text-[12px] font-semibold">{percentageImproved}%</span>
                </div>
            }
            else {
                return <div className="flex items-center">
                    <MoveDown size={10} className="text-red-800 text-[12px]" />
                    <span className="text-red-800 text-[12px] font-semibold">{percentageImproved}%</span>
                </div>
            }
        }
        else {
            return <div className="flex items-center">
                <Minus size={10} className="text-slate-500 text-[12px]" />
            </div>
        }
    }
    else {
        if (currentMetricValue > 0 && oldDataMetricValue > 0) {
            const percentageResult = Math.round(((currentMetricValue - oldDataMetricValue) / oldDataMetricValue) * 100)
            if (percentageResult > 0) {
                return (
                    <div className="flex items-center">
                        <MoveUp size={10} className="text-green-800 text-[12px]" />
                        <span className="text-[#006c35] text-[12px] font-semibold">{percentageResult}%</span>
                    </div>
                )
            }
            else if (percentageResult === 0) {
                return (<div className="flex items-center">
                    <span className="text-slate-500 text-[12px] font-semibold">{percentageResult}%</span>
                </div>)
            }
            else {
                return (<div className="flex items-center">
                    <MoveDown size={10} className="text-red-800 text-[12px]" />
                    <span className="text-red-800 text-[12px] font-semibold">{percentageResult}%</span>
                </div>)
            }
        }
        else {
            return <div className="flex items-center">
                <Minus size={10} className="text-slate-500 text-[12px]" />
            </div>
        }
    }


}

export default PercentageChange
