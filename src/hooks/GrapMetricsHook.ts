import { useEffect, useState } from "react"
import { GraphMetrics } from "@/types/googleapi"
import { GetSiteMetrics } from "@/app/actions/google"
import { useSiteContext } from "@/context/SiteContext";


function GraphMetricsHook(url: string) {
    const { userIdClerk } = useSiteContext();
    const [chartData, setChartData] = useState<GraphMetrics[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await GetSiteMetrics(userIdClerk, url)
            setChartData(data)
        }
        fetchData()
    }, [])

    return { chartData, setChartData }
}

export default GraphMetricsHook