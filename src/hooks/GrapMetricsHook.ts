import { useEffect, useState } from "react"
import { DateMetrics } from "@/types/googleapi"
import { GetDateMetrics } from "@/app/actions/google"
import { useSiteContext } from "@/context/SiteContext";


function GraphMetricsHook(url: string) {
    const { userIdClerk } = useSiteContext();
    const [chartData, setChartData] = useState<DateMetrics[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await GetDateMetrics(userIdClerk, url)
            setChartData(data)
        }
        fetchData()
    }, [])

    return { chartData, setChartData }
}

export default GraphMetricsHook