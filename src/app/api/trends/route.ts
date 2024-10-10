import { HttpsProxyAgent } from 'https-proxy-agent'
//@ts-ignore
import googleTrends from 'google-trends-api'

// Replace with your ProxyScrape proxy
const proxies = [
    'http://104.207.38.218:3128',
    'http://45.201.11.194:3128',
    'http://156.228.91.219:3128',
    'http://45.202.76.118:3128',
    'http://156.228.117.214:3128',
    'http://156.228.124.176:3128',
    'http://104.207.45.111:3128',
    'http://156.228.93.66:3128',
    'http://156.228.80.4:3128',
    'http://156.253.164.89:3128',
    'http://104.207.43.142:3128',
    'http://156.228.118.107:3128',
    'http://156.228.83.133:3128',
    'http://104.207.45.157:3128',
    'http://45.201.11.225:3128',
    'http://104.207.52.139:3128',
    'http://156.233.88.16:3128',
    'http://156.233.95.61:3128',
    'http://104.207.53.135:3128',
    'http://156.233.74.179:3128',
    'http://156.228.124.202:3128',
    'http://104.207.51.179:3128',
    'http://156.228.92.172:3128',
    'http://156.228.124.64:3128',
    'http://154.213.203.251:3128',
    'http://156.228.90.78:3128',
    'http://156.228.110.151:3128',
    'http://156.228.119.183:3128',
    'http://156.228.89.59:3128',
    'http://104.167.25.165:3128',
    'http://156.253.164.47:3128',
    'http://156.228.77.88:3128',
    'http://156.253.171.160:3128',
    'http://104.207.52.217:3128',
    'http://156.228.117.12:3128',
    'http://156.228.190.39:3128',
    'http://156.228.125.82:3128',
    'http://156.233.88.116:3128',
    'http://156.228.124.253:3128',
    'http://104.207.33.116:3128',
    'http://104.207.63.247:3128',
    'http://156.228.177.186:3128',
    'http://156.228.184.23:3128',
    'http://156.228.174.63:3128',
    'http://156.253.169.157:3128',
    'http://104.167.31.2:3128',
    'http://156.228.109.61:3128',
    'http://156.233.72.250:3128',
    'http://154.91.171.20:3128',
    'http://156.228.189.218:3128',
    'http://104.207.37.183:3128',
    'http://45.201.10.230:3128',
    'http://156.228.108.211:3128',
    'http://156.249.137.110:3128',
    'http://104.207.37.193:3128',
    'http://156.228.107.232:3128',
    'http://156.228.0.143:3128',
    'http://154.213.196.229:3128',
    'http://156.228.99.213:3128',
    'http://156.233.74.36:3128',
    'http://154.94.14.54:3128',
    'http://104.207.47.209:3128',
    'http://104.207.41.176:3128',
    'http://156.228.78.198:3128',
    'http://154.213.202.245:3128',
    'http://104.207.55.89:3128',
    'http://156.228.100.23:3128',
    'http://156.253.164.116:3128',
    'http://104.207.42.194:3128',
    'http://156.228.76.236:3128',
    'http://104.207.38.251:3128',
    'http://156.240.99.214:3128',
    'http://104.207.46.18:3128',
    'http://104.207.55.250:3128',
    'http://156.228.92.107:3128',
    'http://156.228.88.182:3128',
    'http://156.228.116.13:3128',
    'http://154.213.194.197:3128',
    'http://156.228.98.206:3128',
    'http://154.213.194.77:3128',
    'http://104.207.41.5:3128',
    'http://104.207.52.77:3128',
    'http://156.253.178.110:3128',
    'http://156.233.72.137:3128',
    'http://156.228.171.49:3128',
    'http://104.207.45.49:3128',
    'http://156.228.177.216:3128',
    'http://156.228.102.58:3128',
    'http://104.207.38.114:3128',
    'http://156.228.106.23:3128',
    'http://104.207.57.16:3128',
    'http://156.228.179.238:3128',
    'http://156.233.94.68:3128',
    'http://104.207.48.160:3128',
    'http://156.253.164.221:3128',
    'http://45.202.77.191:3128',
    'http://156.253.175.71:3128',
    'http://156.253.178.96:3128',
    'http://156.228.185.44:3128',
    'http://156.228.106.143:3128'
];


function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
}


export async function GET(req: Request) {
    const start = new Date();
    start.setDate(new Date().getDate() - 30);

    const proxyUrl = getRandomProxy();
    // const proxyAgent = new HttpsProxyAgent(proxyUrl);

    const endTime = new Date(); // current date
    const startTime = new Date();
    startTime.setDate(endTime.getDate() - 30);

    const query = {
        keyword: 'testing',
        startTime,
        endTime,
        geo: 'US',
        // granularity: 'DAY',
    };
    try {
        // https.get('https://www.npmjs.com/package/https-proxy-agent', { agent: proxyAgent }, (res) => {
        //     console.log('"response" event!', res.headers);
        //     res.pipe(process.stdout);
        // });

        const result = await googleTrends.interestOverTime(query)
        const data = JSON.parse(result)
        const r = data.default.timelineData.map((data: any) => data.value[0])

        return Response.json(r)
    } catch (error: any) {
        return Response.json(JSON.stringify(error?.message))
    }


}

// function getYearlyTrend(data: any) {
//     const groupedByYear = data.reduce((acc, point) => {
//         const year = new Date(point.time * 1000).getFullYear();
//         if (!acc[year]) acc[year] = [];
//         acc[year].push(point.value[0]);
//         return acc;
//     }, {});

//     const years = Object.keys(groupedByYear);
//     const initialYear = years[0];
//     const latestYear = years[years.length - 1];

//     const initialValue = groupedByYear[initialYear].reduce((a, b) => a + b, 0) / groupedByYear[initialYear].length;
//     const latestValue = groupedByYear[latestYear].reduce((a, b) => a + b, 0) / groupedByYear[latestYear].length;

//     if (latestValue > initialValue) return "Trending Up";
//     if (latestValue < initialValue) return "Trending Down";
//     return "Stable";
// }