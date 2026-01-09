"use client";

import Link from "next/link";
import { Button, SEORecordList, ValidationDashboard } from "@seo-console/package";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-gray-900">SEO Console Demo</div>
            <nav className="flex items-center gap-4">
              <Link href="/admin/seo">
                <Button>View Admin Interface</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SEO Console Package - Interface Preview
          </h1>
          <p className="text-xl text-gray-600">
            This is a preview of the admin interface components. The design uses standard Tailwind CSS
            utility classes and will adapt to your project's theme.
          </p>
        </div>

        {/* SEO Records List Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">SEO Records Management</h2>
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <SEORecordList />
          </div>
        </div>

        {/* Validation Dashboard Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Validation Dashboard</h2>
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <ValidationDashboard />
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Theme Integration</h3>
          <p className="text-blue-800">
            These components use Tailwind CSS and will automatically use your project's Tailwind configuration.
            You can customize colors, spacing, and typography through your <code>tailwind.config.js</code>.
          </p>
        </div>
      </main>
    </div>
  );
}
