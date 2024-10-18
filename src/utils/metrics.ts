import { DateKeyDataRow, DateMetrics } from "@/types/googleapi"
import ISO8601 from "./ISO8601"

export const aggregateMonthlyData = (dailyData: DateMetrics[]) => {

    const monthlyData = dailyData.reduce<DateKeyDataRow>((acc, curr) => {
        const month = new ISO8601(curr.date).getYearMonth()
        if (!acc[month]) {
            acc[month] = { ctr: 0, impressions: 0, position: 0, clicks: 0 }
        }
        acc[month].ctr += curr.ctr
        acc[month].impressions += curr.impressions
        acc[month].position += curr.position
        acc[month].clicks += curr.clicks
        return acc
    }, {})

    const monthsCount = Object.keys(monthlyData).length

    return Object.entries(monthlyData).map(([date, data]) => ({
        date,
        ctr: Math.round(data.ctr / monthsCount),
        impressions: data.impressions,
        position: Math.round(data.position / monthsCount),
        clicks: data.clicks,
    }))
}
