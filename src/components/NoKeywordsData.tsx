import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, FileText } from 'lucide-react'

const NoKeywordsData = () => {
    return (
        <Card className="mt-6 mx-6">
            <CardContent>
                <Alert className="my-6">
                    <Search className="w-5 h-5" />
                    <AlertTitle className="text-lg font-semibold ml-2">No ranking keywords found</AlertTitle>
                    <AlertDescription>
                        We couldn't find any keywords ranking for pages on this website. This means that your site isn't currently appearing in Google's search results for any tracked queries.
                    </AlertDescription>
                </Alert>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Possible reasons:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>The website is new and hasn't been indexed by Google yet</li>
                        <li>The website's content might not be optimized for search engines</li>
                        <li>There might be technical issues preventing proper indexing</li>
                        <li>The tracked keywords might not be relevant to your website's content</li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Next steps:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Ensure your website is properly indexed by Google</li>
                        <li>Review and optimize your website's content for relevant keywords</li>
                        <li>Check for any technical SEO issues that might be hindering rankings</li>
                        <li>Consider expanding your keyword tracking to include more relevant terms</li>
                    </ul>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Button className="flex items-center justify-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Run Site Audit
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center">
                        <Search className="w-4 h-4 mr-2" />
                        Keyword Research Tool
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default NoKeywordsData