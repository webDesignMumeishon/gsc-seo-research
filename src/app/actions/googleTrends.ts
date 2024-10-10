'use server'

//@ts-ignore
import googleTrends from 'google-trends-api'

export const googleTrendsTest = () => {

    const query = {
        keyword: 'spokane roofing',
        geo: 'US',  // Use US-WA to limit the search to Washington state
    };

    googleTrends.interestOverTime(query)
        .then((results: any) => {
            const data = JSON.parse(results)
            data.default.timelineData.forEach((element: any) => {
                console.log(`On ${element.formattedTime} - value: ${element.value[0]}`)
            });
            return results
        })
        .catch((err: any) => {
            console.error(err);
        });
}