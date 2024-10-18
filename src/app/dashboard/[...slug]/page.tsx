import DomainDashboard from "@/components/DomainDashboard";
import { redirect } from "next/navigation";

interface DashboardPageProps {
    params: {
        slug: string[];
    };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const decodedSlug = params.slug.map((segment) => decodeURIComponent(segment));

    if (!decodedSlug) {
        redirect('/dashboard')
    }

    return (
        <DomainDashboard url={decodedSlug[0]} />
    );
};

export default DashboardPage;
