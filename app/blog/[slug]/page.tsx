import type { Metadata } from "next";
import { useGenerateMetadata, getRoutePathFromParams } from "@/lib/hooks/useGenerateMetadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Example: Using generateMetadata with dynamic routes
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const routePath = getRoutePathFromParams({ slug }, "/blog/[slug]");

  return useGenerateMetadata({
    routePath,
    fallback: {
      title: `Blog Post: ${slug}`,
      description: `Read our blog post about ${slug}`,
    },
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Blog Post: {slug}
        </h1>
        <p className="text-lg text-gray-600">
          This is a dynamic route example. Create an SEO record for
          &quot;/blog/[slug]&quot; or a specific slug like &quot;/blog/{slug}&quot; to
          customize the metadata.
        </p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Dynamic Route Metadata:</h2>
          <p className="text-gray-700">
            For dynamic routes, you can create SEO records with the actual path
            (e.g., &quot;/blog/my-post&quot;) or use the pattern
            &quot;/blog/[slug]&quot; for a template.
          </p>
        </div>
      </div>
    </div>
  );
}
