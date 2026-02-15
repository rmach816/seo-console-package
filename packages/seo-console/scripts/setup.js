#!/usr/bin/env node

/**
 * SEO Console Setup Script
 * Automatically generates all necessary API routes and admin pages
 * 
 * Usage: npx @seo-console/package setup
 * Or: node node_modules/@seo-console/package/scripts/setup.js
 */

const fs = require("fs").promises;
const path = require("path");

const API_ROUTES_DIR = "app/api";
const ADMIN_DIR = "app/admin/seo";

const API_ROUTES = {
  "seo-records/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { detectStorageConfig, createStorageAdapter } from "@seo-console/package/server";
import { createSEORecordSchema } from "@seo-console/package/server";

export async function GET() {
  try {
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    const isAvailable = await storage.isAvailable();
    if (!isAvailable) {
      return NextResponse.json({ error: "Storage not available" }, { status: 500 });
    }
    const records = await storage.getRecords();
    return NextResponse.json({ data: records || [] });
  } catch (error) {
    console.error("Error fetching SEO records:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSEORecordSchema.parse(body);
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    const record = await storage.createRecord(validated);
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error("Error creating SEO record:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
`,

  "seo-records/[id]/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { detectStorageConfig, createStorageAdapter } from "@seo-console/package/server";
import { updateSEORecordSchema } from "@seo-console/package/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    const record = await storage.getRecordById(id);
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ data: record });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch record" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateSEORecordSchema.parse({ ...body, id });
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    const record = await storage.updateRecord(validated);
    return NextResponse.json({ data: record });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    await storage.deleteRecord(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete record" },
      { status: 500 }
    );
  }
}
`,

  "discover-routes/route.ts": `import { NextResponse } from "next/server";
import { discoverNextJSRoutes } from "@seo-console/package/server";

export async function POST() {
  try {
    const appDir = process.env.NEXT_PUBLIC_APP_DIR || "app";
    const routes = await discoverNextJSRoutes(appDir);
    return NextResponse.json({ routes });
  } catch (error) {
    console.error("Error discovering routes:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to discover routes" },
      { status: 500 }
    );
  }
}
`,

  "import-from-site/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { detectStorageConfig, createStorageAdapter } from "@seo-console/package/server";
import { extractMetadataFromURL, metadataToSEORecord } from "@seo-console/package/server";

export async function POST(request: NextRequest) {
  try {
    const { baseUrl, routes } = await request.json();
    if (!baseUrl) {
      return NextResponse.json({ error: "Base URL is required" }, { status: 400 });
    }
    const routesToImport = Array.isArray(routes) && routes.length > 0 ? routes : ["/"];
    const results = [];
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);

    for (const route of routesToImport) {
      try {
        const url = new URL(route, baseUrl).toString();
        const metadata = await extractMetadataFromURL(url);
        if (Object.keys(metadata).length === 0) {
          results.push({ route, success: false, error: "No metadata found" });
          continue;
        }
        const recordData = metadataToSEORecord(metadata, route, "file-user");
        await storage.createRecord(recordData);
        results.push({ route, success: true });
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        results.push({
          route,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error importing from site:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import from site" },
      { status: 500 }
    );
  }
}
`,

  "auto-setup/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { detectStorageConfig, createStorageAdapter } from "@seo-console/package/server";
import { discoverNextJSRoutes, extractMetadataFromURL, metadataToSEORecord } from "@seo-console/package/server";

export async function POST(request: NextRequest) {
  try {
    const { baseUrl, appDir = "app" } = await request.json();
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Base URL is required (e.g., https://yoursite.com)" },
        { status: 400 }
      );
    }
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    const routes = await discoverNextJSRoutes(appDir);
    const routePaths = routes.map((r) => r.routePath);

    if (routePaths.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No routes found. Make sure your app directory exists.",
        routes: [],
        imported: []
      });
    }

    const imported = [];
    for (const routePath of routePaths) {
      try {
        const url = new URL(routePath, baseUrl).toString();
        const metadata = await extractMetadataFromURL(url);
        if (Object.keys(metadata).length > 0) {
          const recordData = metadataToSEORecord(metadata, routePath, "file-user");
          await storage.createRecord(recordData);
          imported.push({ route: routePath, success: true });
        } else {
          await storage.createRecord({
            userId: "file-user",
            routePath: routePath,
            title: "",
            description: ""
          });
          imported.push({ route: routePath, success: true });
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        imported.push({
          route: routePath,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      routes: routePaths,
      imported: imported.filter((r) => r.success).length,
      total: imported.length,
      results: imported
    });
  } catch (error) {
    console.error("Error in auto-setup:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to auto-setup" },
      { status: 500 }
    );
  }
}
`
};

const ADMIN_PAGE = `"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SEORecord } from "@seo-console/package";

export default function SEOAdminPage() {
  const router = useRouter();
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoSetupRunning, setAutoSetupRunning] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/seo-records");
      const data = await res.json();
      setRecords(data.data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSetup = async () => {
    setAutoSetupRunning(true);
    try {
      const baseUrl = window.location.origin;
      const res = await fetch("/api/auto-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(\`Successfully imported \${data.imported} routes!\`);
        fetchRecords();
      } else {
        alert(\`Error: \${data.error}\`);
      }
    } catch (error) {
      alert(\`Error: \${error instanceof Error ? error.message : "Unknown error"}\`);
    } finally {
      setAutoSetupRunning(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>SEO Management</h1>
      
      {records.length === 0 && (
        <div style={{ marginBottom: "2rem", padding: "1rem", background: "#f0f0f0", borderRadius: "8px" }}>
          <h2>Get Started</h2>
          <p>No SEO records found. Click the button below to automatically discover and import all your pages.</p>
          <button
            onClick={handleAutoSetup}
            disabled={autoSetupRunning}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            {autoSetupRunning ? "Importing..." : "Auto-Setup: Discover & Import All Pages"}
          </button>
        </div>
      )}

      <div>
        <h2>SEO Records ({records.length})</h2>
        {records.length === 0 ? (
          <p>No records yet. Use auto-setup to import your existing pages.</p>
        ) : (
          <ul>
            {records.map((record) => (
              <li key={record.id}>
                <a
                  href={\`/admin/seo/editor?route=\${encodeURIComponent(record.routePath)}\`}
                  style={{ color: "#0070f3", textDecoration: "underline" }}
                >
                  {record.routePath} - {record.title || "No title"}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
`;

async function setupSEOConsole(rootDir = process.cwd()) {
  const files = [];
  const errors = [];

  try {
    // Create API routes directory
    const apiDir = path.join(rootDir, API_ROUTES_DIR);
    await fs.mkdir(apiDir, { recursive: true });

    // Create all API route files
    for (const [routePath, content] of Object.entries(API_ROUTES)) {
      const fullPath = path.join(apiDir, routePath);
      const dir = path.dirname(fullPath);
      
      try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, "utf-8");
        files.push(fullPath);
        console.log(`✓ Created ${fullPath}`);
      } catch (error) {
        const errorMsg = `Failed to create ${fullPath}: ${error instanceof Error ? error.message : "Unknown error"}`;
        errors.push(errorMsg);
        console.error(`✗ ${errorMsg}`);
      }
    }

    // Create admin page
    const adminPagePath = path.join(rootDir, ADMIN_DIR, "page.tsx");
    try {
      await fs.mkdir(path.dirname(adminPagePath), { recursive: true });
      await fs.writeFile(adminPagePath, ADMIN_PAGE, "utf-8");
      files.push(adminPagePath);
      console.log(`✓ Created ${adminPagePath}`);
    } catch (error) {
      const errorMsg = `Failed to create admin page: ${error instanceof Error ? error.message : "Unknown error"}`;
      errors.push(errorMsg);
      console.error(`✗ ${errorMsg}`);
    }

    console.log(`\n✅ Setup complete! Created ${files.length} files.`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} errors occurred.`);
    }

    return {
      success: errors.length === 0,
      files,
      errors
    };
  } catch (error) {
    const errorMsg = `Setup failed: ${error instanceof Error ? error.message : "Unknown error"}`;
    errors.push(errorMsg);
    console.error(`✗ ${errorMsg}`);
    return {
      success: false,
      files,
      errors
    };
  }
}

// Run if called directly
if (require.main === module) {
  setupSEOConsole().then((result) => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { setupSEOConsole };
