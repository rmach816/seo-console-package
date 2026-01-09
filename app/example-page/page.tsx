import type { Metadata } from "next";
import { useGenerateMetadata } from "@/lib/hooks/useGenerateMetadata";

// Example: Using generateMetadata with SEO records
export async function generateMetadata(): Promise<Metadata> {
  return useGenerateMetadata({
    routePath: "/example-page",
    fallback: {
      title: "Example Page",
      description: "This is an example page demonstrating SEO metadata integration",
    },
  });
}

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Example Page
        </h1>
        <p className="text-lg text-gray-600">
          This page demonstrates the SEO metadata integration. Create an SEO
          record for this route in the dashboard to see custom metadata applied.
        </p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">How it works:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to the dashboard and create an SEO record</li>
            <li>Set the route path to &quot;/example-page&quot;</li>
            <li>Fill in the metadata fields (title, description, OG tags, etc.)</li>
            <li>View the page source to see the metadata in the HTML head</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
