"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";

const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
  green: "#0bda5e",
  red: "#ef4444",
  yellow: "#eab308",
};

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "pass" | "fail" | "warning" | "pending";
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function SEOChecklist() {
  const [checking, setChecking] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "public-access",
      title: "Site is publicly accessible",
      description: "No authentication wall blocking search engines",
      status: "pending",
    },
    {
      id: "no-noindex",
      title: "No noindex on important pages",
      description: "Important pages don't have noindex meta tags",
      status: "pending",
    },
    {
      id: "robots-allows",
      title: "robots.txt allows crawling",
      description: "robots.txt doesn't block important pages",
      status: "pending",
      action: {
        label: "View robots.txt",
        href: "/robots.txt",
      },
    },
    {
      id: "http-200",
      title: "Pages return HTTP 200",
      description: "No 404 errors or redirect loops",
      status: "pending",
    },
    {
      id: "sitemap-exists",
      title: "Sitemap.xml exists",
      description: "Sitemap is accessible at /sitemap.xml",
      status: "pending",
      action: {
        label: "View sitemap",
        href: "/sitemap.xml",
      },
    },
    {
      id: "sitemap-in-robots",
      title: "Sitemap referenced in robots.txt",
      description: "robots.txt includes sitemap reference",
      status: "pending",
    },
    {
      id: "unique-titles",
      title: "Unique titles (50-60 chars)",
      description: "Each page has unique, optimized title",
      status: "pending",
    },
    {
      id: "meta-descriptions",
      title: "Meta descriptions (140-160 chars)",
      description: "Each page has optimized meta description",
      status: "pending",
    },
    {
      id: "canonical-tags",
      title: "Canonical tags set",
      description: "All pages have canonical URLs",
      status: "pending",
    },
    {
      id: "h1-tags",
      title: "H1 tags present",
      description: "Each page has one H1 matching search intent",
      status: "pending",
    },
    {
      id: "https-enabled",
      title: "HTTPS enabled",
      description: "Site uses HTTPS (required for ranking)",
      status: "pending",
    },
    {
      id: "og-metadata",
      title: "Open Graph metadata",
      description: "Pages have OG tags for social sharing",
      status: "pending",
    },
  ]);

  const handleCheck = async () => {
    setChecking(true);

    // Check each item
    const baseUrl = window.location.origin;
    const updatedItems = [...items];

    // Check public access
    try {
      const response = await fetch(baseUrl, { method: "HEAD" });
      updatedItems[0].status = response.ok && response.status !== 401 && response.status !== 403 ? "pass" : "fail";
    } catch {
      updatedItems[0].status = "fail";
    }

    // Check robots.txt
    try {
      const robotsRes = await fetch(`${baseUrl}/robots.txt`);
      if (robotsRes.ok) {
        const robotsTxt = await robotsRes.text();
        updatedItems[2].status = robotsTxt.includes("Sitemap:") ? "pass" : "warning";
        updatedItems[5].status = robotsTxt.includes("Sitemap:") ? "pass" : "fail";
      } else {
        updatedItems[2].status = "warning";
        updatedItems[5].status = "fail";
      }
    } catch {
      updatedItems[2].status = "warning";
      updatedItems[5].status = "fail";
    }

    // Check sitemap
    try {
      const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
      updatedItems[4].status = sitemapRes.ok ? "pass" : "fail";
    } catch {
      updatedItems[4].status = "fail";
    }

    // Check HTTPS
    updatedItems[11].status = window.location.protocol === "https:" ? "pass" : "fail";

    // Check SEO records (via API)
    try {
      const recordsRes = await fetch("/api/seo-records");
      if (recordsRes.ok) {
        const data = await recordsRes.json();
        const records = data.data || [];

        // Check unique titles
        const titles = records.map((r: any) => r.title).filter(Boolean);
        const uniqueTitles = new Set(titles);
        updatedItems[6].status = titles.length === uniqueTitles.size && titles.every((t: string) => t.length >= 50 && t.length <= 60) ? "pass" : "warning";

        // Check meta descriptions
        const descriptions = records.map((r: any) => r.description).filter(Boolean);
        updatedItems[7].status = descriptions.every((d: string) => d.length >= 140 && d.length <= 160) ? "pass" : "warning";

        // Check canonical tags
        const canonicals = records.map((r: any) => r.canonicalUrl).filter(Boolean);
        updatedItems[8].status = canonicals.length === records.length ? "pass" : "warning";

        // Check OG metadata
        const ogImages = records.map((r: any) => r.ogImageUrl).filter(Boolean);
        updatedItems[12].status = ogImages.length > 0 ? "pass" : "warning";
      }
    } catch {
      // API check failed
    }

    setItems(updatedItems);
    setChecking(false);
  };

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle style={{ width: 20, height: 20, color: colors.green }} />;
      case "fail":
        return <XCircle style={{ width: 20, height: 20, color: colors.red }} />;
      case "warning":
        return <AlertTriangle style={{ width: 20, height: 20, color: colors.yellow }} />;
      default:
        return <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${colors.textSecondary}` }} />;
    }
  };

  const getStatusColor = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "pass":
        return colors.green;
      case "fail":
        return colors.red;
      case "warning":
        return colors.yellow;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <div style={{
      backgroundColor: colors.surfaceDark,
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${colors.borderDark}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>SEO Checklist</h3>
        <button
          onClick={handleCheck}
          disabled={checking}
          style={{
            padding: "8px 16px",
            backgroundColor: colors.primary,
            border: "none",
            borderRadius: 8,
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            cursor: checking ? "not-allowed" : "pointer",
            opacity: checking ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {checking ? (
            <>
              <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
              Checking...
            </>
          ) : (
            "Run Checklist"
          )}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: 16,
              backgroundColor: colors.backgroundDark,
              borderRadius: 8,
              border: `1px solid ${getStatusColor(item.status)}40`,
            }}
          >
            {getStatusIcon(item.status)}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 4 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>
                {item.description}
              </div>
            </div>
            {item.action && (
              <div>
                {item.action.href ? (
                  <a
                    href={item.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: colors.primary,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {item.action.label}
                    <ExternalLink style={{ width: 12, height: 12 }} />
                  </a>
                ) : (
                  <button
                    onClick={item.action.onClick}
                    style={{
                      fontSize: 12,
                      color: colors.primary,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {item.action.label}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: 16, backgroundColor: colors.backgroundDark, borderRadius: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: colors.textSecondary, marginBottom: 8 }}>
          Next Steps:
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.6 }}>
          <div>1. Fix any failed items (red)</div>
          <div>2. Address warnings (yellow)</div>
          <div>3. Register with Google Search Console (see guide)</div>
          <div>4. Register with Bing Webmaster Tools (see guide)</div>
          <div>5. Submit your sitemap to both</div>
        </div>
      </div>
    </div>
  );
}
