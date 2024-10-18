import { DateKeyDataRow, DateMetrics } from "@/types/googleapi"
import ISO8601 from "./ISO8601"

export const aggregateMonthlyData = (dailyData: DateMetrics[]) => {

    const monthlyData = dailyData.reduce<DateKeyDataRow>((acc, curr) => {
        const month = new ISO8601(curr.date).getYearMonth()
        if (!acc[month]) {
            acc[month] = { ctr: 0, impressions: 0, position: 0, clicks: 0 }
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
        }
        return acc
    }, {})

    const monthsCount = Object.keys(monthlyData).length

    return Object.entries(monthlyData).map(([date, data]) => ({
        date,
        ctr: Math.round(data?.ctr || 0 / monthsCount),
        impressions: data.impressions,
        position: Math.round(data?.position || 0 / monthsCount),
        clicks: data.clicks,
    }))
}
