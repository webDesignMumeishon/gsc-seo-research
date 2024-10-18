// app/dashboard/[...slug]/page.tsx

import { GetPagesMetrics, GetSiteMetrics } from "@/app/actions/google";
import DomainDashboard from "@/components/DomainDashboard";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface DashboardPageProps {
    params: {
        slug: string[];
    };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const user = auth()
    const decodedSlug = params.slug.map((segment) => decodeURIComponent(segment));

    if (user.userId === null) {
        redirect('/')
    }

    if (!decodedSlug) {
        redirect('/dashboard')
    }

    const data = await GetSiteMetrics(user.userId, decodedSlug[0])
    const pageData = await GetPagesMetrics(user.userId, decodedSlug[0])

    return (
        <DomainDashboard chartData={data} pageData={pageData} />
    );
};

export default DashboardPage;
