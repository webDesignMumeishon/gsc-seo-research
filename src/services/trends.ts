// import { HttpsProxyAgent } from 'https-proxy-agent'
// //@ts-ignore
// import googleTrends from 'google-trends-api'

// class GoogleTrends {
//     public trends = googleTrends

//     private static proxies = [
//         '188.132.222.230:8080',
//     ];

//     private static getRandomProxy() {
//         const randomIndex = Math.floor(Math.random() * this.proxies.length);
//         return this.proxies[randomIndex];
//     }

//     public static async getInterestByDate(startTime: Date, endTime: Date, keyword: string) {
//         const start = new Date();
//         start.setDate(new Date().getDate() - 30);


//         let proxyAgent = new HttpsProxyAgent('http://156.228.91.219:3128');

//         const result = await googleTrends.interestOverTime({
//             keyword,
//             startTime: start,
//             endTime: new Date(),
//             granularity: 'DAY',
//             requestOptions: {
//                 agent: proxyAgent // Use the proxy agent
//             }
//         })
//         const data = JSON.parse(result)
//         return data.default.timelineData.map((data: any) => data.value[0])
//     }
// }

// export default GoogleTrends