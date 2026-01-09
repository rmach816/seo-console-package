import { SEORecordList } from "@/components/seo/SEORecordList";

export default async function DashboardPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Console</h1>
        <p className="text-gray-600 mt-1">
          Manage your SEO metadata and validation records.
        </p>
      </div>

      <SEORecordList />
    </div>
  );
}
