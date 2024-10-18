import { useEffect, useState } from "react"
import { DateMetrics } from "@/types/googleapi"
import { GetDateMetrics } from "@/app/actions/google"
import { useSiteContext } from "@/context/SiteContext";
import moment from "moment";


function GraphMetricsHook(url: string) {
    const { userIdClerk } = useSiteContext();
    const [chartData, setChartData] = useState<DateMetrics[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await GetDateMetrics(userIdClerk, url, moment().toDate(), moment().toDate())
            setChartData(data)
        }
        fetchData()
    }, [])

    return { chartData, setChartData }
}

export default GraphMetricsHook