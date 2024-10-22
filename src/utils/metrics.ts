import { DateKeyDataRow, DateMetrics } from "@/types/googleapi"
import ISO8601 from "./ISO8601"
import { YYYYMMDD } from "./dateService"

export type Data = {
    [key: string]: {
        clicks: number
        ctr: number
        position: number
        impressions: number
        keys?: string[]
        count: number
    }
}

export const aggregateMonthlyData = (dailyData: DateMetrics[]): DateMetrics[] => {
    const monthlyData = dailyData.reduce<Data>((acc, curr) => {
        const month = new ISO8601(curr.date as YYYYMMDD).getYearMonth()

        if (!acc[month]) {
            acc[month] = { ctr: 0, impressions: 0, position: 0, clicks: 0, count: 0 }
        }

        if (month !== null && acc[month] !== null) {

            if (acc[month]?.ctr !== null) {
                acc[month].ctr += curr?.ctr || 0
            }

            if (acc[month]?.impressions !== null) {
                acc[month].impressions += curr?.impressions || 0
            }

            if (acc[month]?.position !== null) {
                acc[month].position += curr?.position || 0
            }

            if (acc[month]?.clicks !== null) {
                acc[month].clicks += curr?.clicks || 0
            }

            if (acc[month]?.count !== null) {
                acc[month].count += 1
            }

        }
        return acc
    }, {})

    return Object.entries(monthlyData).map(([date, data]) => ({
        date,
        ctr: Math.round(data?.ctr || 0) / data.count,
        impressions: data.impressions,
        position: Math.round(data?.position || 0) / data.count,
        clicks: data.clicks,
    }))
}

export function aggregateWeeklyData(data: DateMetrics[]): DateMetrics[] {
    const weeklyData: DateMetrics[] = [];

    data.reduce((acc: any, current, index) => {
        // Group data into weeks (7 days per group)
        const dayIndex = index % 7;

        // If first day of the week, initialize a new object
        if (dayIndex === 0) {
            acc = {
                date: current.date, // Start with the first day
                clicks: 0,
                ctr: 0,
                impressions: 0,
                position: 0,
                count: 0 // To help average `ctr` and `position`
            };
        }

        // Aggregate data
        acc.clicks += current.clicks;
        acc.ctr += current.ctr;
        acc.impressions += current.impressions;
        acc.position += current.position;
        acc.count += 1;

        // On the last day of the week, push the aggregate data to the result
        if (dayIndex === 6 || index === data.length - 1) {
            // Average `ctr` and `position`
            acc.ctr /= acc.count;
            acc.position /= acc.count;

            // Use the last day of the week as the date
            acc.date = current.date;
            weeklyData.push({
                date: acc.date,
                clicks: acc.clicks,
                ctr: acc.ctr,
                impressions: acc.impressions,
                position: acc.position
            });
        }

        return acc;
    }, {});

    return weeklyData;
}
