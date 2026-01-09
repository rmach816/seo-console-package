"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ChevronDown, 
  Bell, 
  Link as LinkIcon, 
  Bot, 
  Image as ImageIcon,
  AlertTriangle,
  Type,
  Search,
  Filter,
  LayoutDashboard,
  FileEdit,
  SearchCheck,
  BarChart3,
  Settings as SettingsIcon,
  TrendingUp,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import type { SEORecord } from "@seo-console/package";
import { ToastContainer, useToast } from "./components/Toast";
import { AutoDiscoverButton } from "./components/AutoDiscoverButton";
import { ImportFromSiteButton } from "./components/ImportFromSiteButton";
import { GenerateSitemapButton } from "./components/GenerateSitemapButton";
import { SEOChecklist } from "./components/SEOChecklist";
import { SearchEngineRegistrationGuide } from "./components/SearchEngineRegistrationGuide";
import { ThemeToggle } from "./components/ThemeToggle";

// Color constants
const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
  green: "#0bda5e",
  red: "#ef4444",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
};

export default function SEOAdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toasts, removeToast, success, error, info } = useToast();
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewRouteModal, setShowNewRouteModal] = useState(false);
  const [showAIScanModal, setShowAIScanModal] = useState(false);
  const [showOGPreviewModal, setShowOGPreviewModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<SEORecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "valid" | "warning" | "invalid">("all");
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<"route" | "status" | "title">("route");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sample data for demo when no records exist
  const sampleRecords: SEORecord[] = [
    {
      id: "1",
      userId: "demo-user",
      routePath: "/",
      title: "Home - NextSEO Console",
      description: "Welcome to NextSEO Console",
      validationStatus: "valid",
      ogImageUrl: "https://example.com/og-image.jpg",
      canonicalUrl: "https://example.com/",
    },
    {
      id: "2",
      userId: "demo-user",
      routePath: "/blog/[slug]",
      title: "Dynamic Blog Post",
      description: "Blog post content",
      validationStatus: "warning",
      robots: "index, follow",
    },
    {
      id: "3",
      userId: "demo-user",
      routePath: "/contact",
      title: "Contact Us",
      description: "Get in touch",
      validationStatus: "invalid",
    },
  ];

  useEffect(() => {
    fetch("/api/seo-records")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRecords(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching SEO records:", err);
        setLoading(false);
      });
  }, []);

  // Use sample data if no records exist
  const displayRecordsForScore = records.length > 0 ? records : sampleRecords;
  
  // Calculate SEO health score
  const totalRecords = displayRecordsForScore.length;
  const validRecords = displayRecordsForScore.filter((r) => r.validationStatus === "valid").length;
  const warningRecords = displayRecordsForScore.filter((r) => r.validationStatus === "warning").length;
  
  const healthScore = totalRecords > 0
    ? Math.round(((validRecords * 100 + warningRecords * 50) / totalRecords))
    : 88;

  // Get critical issues
  const criticalIssues = records.length > 0
    ? [
        ...(records.filter((r) => !r.description).length > 0
          ? [{
              id: "1",
              type: "error" as const,
              title: "Missing Meta Descriptions",
              routes: records.filter((r) => !r.description).slice(0, 2).map((r) => r.routePath).join(", "),
              routePaths: records.filter((r) => !r.description).slice(0, 2).map((r) => r.routePath),
            }]
          : []),
        ...(records.filter((r) => r.title && r.title.length > 60).length > 0
          ? [{
              id: "2",
              type: "warning" as const,
              title: "Title Too Long",
              routes: records.find((r) => r.title && r.title.length > 60)?.routePath || "",
              routePaths: [records.find((r) => r.title && r.title.length > 60)?.routePath || ""],
            }]
          : []),
      ].slice(0, 2)
    : [
        { id: "1", type: "error" as const, title: "Missing Meta Descriptions", routes: "/blog/nextjs-14-updates, /about-us", routePaths: ["/blog/nextjs-14-updates", "/about-us"] },
        { id: "2", type: "warning" as const, title: "Title Too Long", routes: "/services/consulting-enterprise-solutions", routePaths: ["/services/consulting-enterprise-solutions"] },
      ];

  const displayRecords = records.length > 0 ? records : sampleRecords;
  
  // Filter records by search and status
  const filteredRecords = displayRecords
    .filter((record) => {
      const matchesSearch = record.routePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || record.validationStatus === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "route") {
        comparison = a.routePath.localeCompare(b.routePath);
      } else if (sortBy === "status") {
        const statusOrder = { valid: 1, warning: 2, invalid: 3 };
        comparison = (statusOrder[a.validationStatus as keyof typeof statusOrder] || 0) - 
                    (statusOrder[b.validationStatus as keyof typeof statusOrder] || 0);
      } else if (sortBy === "title") {
        comparison = (a.title || "").localeCompare(b.title || "");
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handleNewRoute = async (routePath: string) => {
    try {
      const response = await fetch("/api/seo-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routePath,
          title: "",
          description: "",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setRecords([...records, data.data]);
        setShowNewRouteModal(false);
        success("Route created successfully!");
        // Refresh records
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Error creating route:", error);
      error("Failed to create route. Please try again.");
    }
  };

  const handleAIScan = async () => {
    setIsScanning(true);
    setScanResults([]);
    
    // Simulate AI scan
    setTimeout(() => {
      const results = [
        "✓ All meta titles are optimized",
        "⚠ 2 routes missing descriptions",
        "✓ OG images generated for 5 routes",
        "⚠ 1 route has title > 60 characters",
        "✓ Canonical URLs properly set",
      ];
      setScanResults(results);
      setIsScanning(false);
    }, 2000);
  };

  const handleFixIssue = async (issueId: string, issueType: string) => {
    if (issueType === "error") {
      // Navigate to editor to fix
      router.push("/admin/seo/editor");
      info("Navigating to editor to fix issue");
    } else {
      // Skip warning
      info("Issue skipped. You can fix it later from the Editor.");
    }
  };

  const handleRouteClick = (record: SEORecord) => {
    router.push(`/admin/seo/editor?route=${encodeURIComponent(record.routePath)}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.backgroundDark,
      color: "white",
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      overflowX: "hidden",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(16, 22, 34, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.borderDark}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
            <div style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: colors.primary,
              color: "white",
              fontWeight: "bold",
              fontSize: 14,
              flexShrink: 0,
            }}>
              LE
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <h1 style={{ fontSize: 16, fontWeight: "bold", margin: 0, color: "white" }}>NextSEO Console</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: colors.textSecondary }}>
                <span>acme-corp-web</span>
                <ChevronDown style={{ width: 12, height: 12 }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <button style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}>
              <Bell style={{ width: 20, height: 20, color: colors.textSecondary }} />
            </button>
            <button style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${colors.borderDark}`,
              backgroundColor: colors.primary,
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              position: "relative",
            }}>
              U
              <span style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 10,
                height: 10,
                backgroundColor: colors.red,
                borderRadius: "50%",
                border: `2px solid ${colors.backgroundDark}`,
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ display: "flex", flexDirection: "column", width: "100%", paddingBottom: 96 }}>
        {/* Score Card */}
        <section style={{ padding: "24px 16px 16px" }}>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${colors.borderDark}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <p style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Global SEO Health</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <h2 style={{ fontSize: 36, fontWeight: "bold", color: "white", margin: 0 }}>{healthScore}</h2>
                  <span style={{ color: colors.textSecondary, fontSize: 18 }}>/100</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{
                  backgroundColor: "rgba(11, 218, 94, 0.1)",
                  color: colors.green,
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  <TrendingUp style={{ width: 12, height: 12 }} />
                  +4%
                </div>
                <p style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>vs last 7 days</p>
              </div>
            </div>
            {/* Chart */}
            <div style={{ height: 96, width: "100%", position: "relative", overflow: "hidden", borderRadius: 8 }}>
              <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#135bec" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#135bec" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.61 41C90.76 41 90.76 93 108.9 93C127.0 93 127.0 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.0 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25V150H0V109Z" fill="url(#chartGradient)" />
                <path d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.61 41C90.76 41 90.76 93 108.9 93C127.0 93 127.0 33 145.2 33C163.3 33 163.3 101 181.5 101C199.6 101 199.6 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.0 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25" stroke="#135bec" strokeLinecap="round" strokeWidth="3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={{ padding: "0 16px 16px" }}>
          <h3 style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Quick Actions</h3>
          <div style={{ 
            display: "flex", 
            gap: 12, 
            overflowX: "auto", 
            paddingBottom: 8,
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}>
            <button 
              onClick={() => setShowNewRouteModal(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceDark,
                border: `1px solid ${colors.borderDark}`,
                minWidth: 100,
                height: 100,
                borderRadius: 12,
                padding: 12,
                cursor: "pointer",
              }}
            >
              <div style={{
                backgroundColor: `${colors.primary}33`,
                padding: 8,
                borderRadius: "50%",
                marginBottom: 8,
              }}>
                <LinkIcon style={{ width: 24, height: 24, color: colors.primary }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "white", textAlign: "center" }}>New Route</span>
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
              <AutoDiscoverButton />
              <ImportFromSiteButton />
              <GenerateSitemapButton />
            </div>
            <button 
              onClick={() => setShowAIScanModal(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceDark,
                border: `1px solid ${colors.borderDark}`,
                minWidth: 100,
                height: 100,
                borderRadius: 12,
                padding: 12,
                cursor: "pointer",
              }}
            >
              <div style={{
                backgroundColor: `${colors.purple}33`,
                padding: 8,
                borderRadius: "50%",
                marginBottom: 8,
              }}>
                <Bot style={{ width: 24, height: 24, color: colors.purple }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "white", textAlign: "center" }}>AI Scan</span>
            </button>
            <button 
              onClick={() => setShowOGPreviewModal(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceDark,
                border: `1px solid ${colors.borderDark}`,
                minWidth: 100,
                height: 100,
                borderRadius: 12,
                padding: 12,
                cursor: "pointer",
              }}
            >
              <div style={{
                backgroundColor: `${colors.orange}33`,
                padding: 8,
                borderRadius: "50%",
                marginBottom: 8,
              }}>
                <ImageIcon style={{ width: 24, height: 24, color: colors.orange }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "white", textAlign: "center" }}>OG Preview</span>
            </button>
          </div>
        </section>

        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <section style={{ padding: "0 16px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ color: "white", fontSize: 18, fontWeight: "bold", margin: 0 }}>Critical Issues</h3>
              <Link href="/admin/seo/reports" style={{ color: colors.primary, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>View All</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {criticalIssues.map((issue) => {
                const isError = issue.type === "error";
                return (
                  <div key={issue.id} style={{
                    backgroundColor: colors.surfaceDark,
                    border: `1px solid ${isError ? "rgba(239, 68, 68, 0.3)" : "rgba(234, 179, 8, 0.3)"}`,
                    borderRadius: 8,
                    padding: 16,
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}>
                    <div style={{
                      backgroundColor: isError ? "rgba(239, 68, 68, 0.1)" : "rgba(234, 179, 8, 0.1)",
                      padding: 8,
                      borderRadius: 8,
                      flexShrink: 0,
                    }}>
                      {isError ? (
                        <AlertTriangle style={{ width: 20, height: 20, color: colors.red }} />
                      ) : (
                        <Type style={{ width: 20, height: 20, color: colors.yellow }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: "bold", color: "white", marginBottom: 4 }}>{issue.title}</p>
                      <p style={{ fontSize: 12, color: colors.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {issue.routes}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleFixIssue(issue.id, issue.type)}
                      style={{
                        backgroundColor: isError ? colors.primary : colors.surfaceDark,
                        border: isError ? "none" : `1px solid ${colors.borderDark}`,
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                        padding: "6px 12px",
                        borderRadius: 4,
                        cursor: "pointer",
                        alignSelf: "center",
                      }}
                    >
                      {isError ? "Fix" : "Skip"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Pages & Routes */}
        <section style={{ padding: "0 16px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "white", fontSize: 18, fontWeight: "bold", margin: 0 }}>Pages &amp; Routes</h3>
            {bulkActionMode && selectedRoutes.size > 0 && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: colors.textSecondary }}>
                  {selectedRoutes.size} selected
                </span>
                <button
                  onClick={async () => {
                    // Bulk validate
                    const promises = Array.from(selectedRoutes).map((id) =>
                      fetch(`/api/seo-records/${id}/validate`, { method: "POST" })
                    );
                    await Promise.all(promises);
                    success(`Validated ${selectedRoutes.size} routes`);
                    setSelectedRoutes(new Set());
                  }}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: colors.primary,
                    border: "none",
                    borderRadius: 6,
                    color: "white",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Validate Selected
                </button>
                <button
                  onClick={() => {
                    setSelectedRoutes(new Set());
                    setBulkActionMode(false);
                  }}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: colors.surfaceDark,
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 6,
                    color: "white",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            {!bulkActionMode && (
              <button
                onClick={() => setBulkActionMode(true)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: colors.surfaceDark,
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 6,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Select Multiple
              </button>
            )}
          </div>
          <div style={{
            backgroundColor: colors.surfaceDark,
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {/* Search Bar */}
            <div style={{ padding: 12, borderBottom: `1px solid ${colors.borderDark}`, display: "flex", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, color: colors.textSecondary }} />
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#111722",
                    color: "white",
                    fontSize: 14,
                    borderRadius: 8,
                    padding: "8px 16px 8px 40px",
                    border: "none",
                    outline: "none",
                  }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => {
                    const statuses: Array<"all" | "valid" | "warning" | "invalid"> = ["all", "valid", "warning", "invalid"];
                    const currentIndex = statuses.indexOf(filterStatus);
                    setFilterStatus(statuses[(currentIndex + 1) % statuses.length]);
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: "#111722",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Filter style={{ width: 20, height: 20, color: colors.textSecondary }} />
                </button>
                {filterStatus !== "all" && (
                  <span style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 8,
                    height: 8,
                    backgroundColor: colors.primary,
                    borderRadius: "50%",
                    border: `2px solid ${colors.surfaceDark}`,
                  }} />
                )}
              </div>
            </div>
            <div style={{ padding: "8px 12px", borderBottom: `1px solid ${colors.borderDark}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
              {filterStatus !== "all" && (
                <span style={{ color: colors.textSecondary }}>
                  Filter: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </span>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: colors.textSecondary }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "route" | "status" | "title")}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: colors.backgroundDark,
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 4,
                    color: "white",
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="route">Route Path</option>
                  <option value="status">Status</option>
                  <option value="title">Title</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: colors.surfaceDark,
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 4,
                    color: "white",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
            {/* Routes List */}
            {loading && records.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: colors.textSecondary }}>Loading routes...</div>
            ) : filteredRecords.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: colors.textSecondary }}>No routes match your search.</div>
            ) : (
              <div>
                {paginatedRecords.map((record, idx) => {
                  const isLast = idx === filteredRecords.length - 1;
                  const statusColor = record.validationStatus === "valid" ? colors.green : record.validationStatus === "invalid" ? colors.red : colors.yellow;
                  const statusText = record.validationStatus === "valid" ? "Valid" : record.validationStatus === "invalid" ? "Error" : "Warning";
                  const isDynamic = record.routePath.includes("[") || record.routePath.includes("...");

                  const isSelected = selectedRoutes.has(record.id);
                  
                  return (
                    <div 
                      key={record.id} 
                      onClick={(e) => {
                        if (bulkActionMode) {
                          e.stopPropagation();
                          const newSelected = new Set(selectedRoutes);
                          if (isSelected) {
                            newSelected.delete(record.id);
                          } else {
                            newSelected.add(record.id);
                          }
                          setSelectedRoutes(newSelected);
                        } else {
                          handleRouteClick(record);
                        }
                      }}
                      style={{
                        borderBottom: isLast ? "none" : `1px solid ${colors.borderDark}`,
                        padding: 16,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        backgroundColor: isSelected ? "rgba(19, 91, 236, 0.1)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        {bulkActionMode && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              const newSelected = new Set(selectedRoutes);
                              if (e.target.checked) {
                                newSelected.add(record.id);
                              } else {
                                newSelected.delete(record.id);
                              }
                              setSelectedRoutes(newSelected);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              marginRight: 12,
                              width: 18,
                              height: 18,
                              cursor: "pointer",
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                        <div>
                          <span style={{
                            backgroundColor: isDynamic ? "rgba(168, 85, 247, 0.2)" : "rgba(19, 91, 236, 0.2)",
                            color: isDynamic ? colors.purple : colors.primary,
                            fontSize: 10,
                            fontWeight: "bold",
                            padding: "2px 6px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            display: "inline-block",
                            marginBottom: 4,
                          }}>
                            {isDynamic ? "DYNAMIC" : "STATIC"}
                          </span>
                          <h4 style={{ fontSize: 16, fontWeight: 500, color: "white", fontFamily: "monospace", margin: 0 }}>{record.routePath}</h4>
                        </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: statusColor }} />
                          <span style={{ fontSize: 12, color: statusColor }}>{statusText}</span>
                        </div>
                      </div>
                      {record.validationStatus === "invalid" && !record.canonicalUrl ? (
                        <div style={{ marginTop: 8, fontSize: 12, color: colors.red, display: "flex", alignItems: "center", gap: 4 }}>
                          <AlertTriangle style={{ width: 12, height: 12 }} />
                          Missing canonical URL
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8, fontSize: 12 }}>
                          <div>
                            <span style={{ color: colors.textSecondary, display: "block", marginBottom: 2 }}>Title</span>
                            <span style={{ color: "white" }}>{record.title || "—"}</span>
                          </div>
                          <div>
                            <span style={{ color: colors.textSecondary, display: "block", marginBottom: 2 }}>OG Image</span>
                            {record.ogImageUrl ? (
                              <span style={{ color: colors.green, display: "flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle style={{ width: 12, height: 12 }} />
                                Generated
                              </span>
                            ) : (
                              <span style={{ color: colors.textSecondary }}>Not set</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {/* Pagination */}
            {filteredRecords.length > itemsPerPage && (
              <div style={{
                padding: 16,
                borderTop: `1px solid ${colors.borderDark}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} routes
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: currentPage === 1 ? colors.surfaceDark : colors.primary,
                      border: "none",
                      borderRadius: 6,
                      color: "white",
                      fontSize: 12,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: 12, color: colors.textSecondary }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: currentPage === totalPages ? colors.surfaceDark : colors.primary,
                      border: "none",
                      borderRadius: 6,
                      color: "white",
                      fontSize: 12,
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* New Route Modal */}
      {showNewRouteModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }} onClick={() => setShowNewRouteModal(false)}>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 24,
            width: "90%",
            maxWidth: 400,
            border: `1px solid ${colors.borderDark}`,
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>New Route</h2>
              <button onClick={() => setShowNewRouteModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textSecondary }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <NewRouteForm onClose={() => setShowNewRouteModal(false)} onSubmit={handleNewRoute} />
          </div>
        </div>
      )}

      {/* AI Scan Modal */}
      {showAIScanModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }} onClick={() => setShowAIScanModal(false)}>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 24,
            width: "90%",
            maxWidth: 500,
            border: `1px solid ${colors.borderDark}`,
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>AI Scan</h2>
              <button onClick={() => setShowAIScanModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textSecondary }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
                Scan all routes for SEO issues and optimization opportunities.
              </p>
              <button
                onClick={handleAIScan}
                disabled={isScanning}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: colors.primary,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: isScanning ? "not-allowed" : "pointer",
                  opacity: isScanning ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {isScanning ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                    Scanning...
                  </>
                ) : (
                  "Start Scan"
                )}
              </button>
            </div>
            {scanResults.length > 0 && (
              <div style={{
                backgroundColor: colors.backgroundDark,
                borderRadius: 8,
                padding: 16,
                border: `1px solid ${colors.borderDark}`,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: "bold", marginBottom: 12 }}>Scan Results</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {scanResults.map((result, idx) => (
                    <div key={idx} style={{ fontSize: 13, color: colors.textSecondary }}>
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OG Preview Modal */}
      {showOGPreviewModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }} onClick={() => setShowOGPreviewModal(false)}>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 24,
            width: "90%",
            maxWidth: 600,
            border: `1px solid ${colors.borderDark}`,
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>OG Image Preview</h2>
              <button onClick={() => setShowOGPreviewModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textSecondary }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={{
              backgroundColor: colors.backgroundDark,
              borderRadius: 8,
              padding: 16,
              border: `1px solid ${colors.borderDark}`,
            }}>
              <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
                Select a route to preview its OG image:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
                {displayRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => {
                      setSelectedRoute(record);
                      if (record.ogImageUrl) {
                        window.open(record.ogImageUrl, "_blank");
                      }
                    }}
                    style={{
                      padding: 12,
                      backgroundColor: colors.surfaceDark,
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 8,
                      textAlign: "left",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    <div style={{ fontFamily: "monospace", fontSize: 14, marginBottom: 4 }}>{record.routePath}</div>
                    {record.ogImageUrl ? (
                      <div style={{ fontSize: 12, color: colors.green }}>✓ OG Image available</div>
                    ) : (
                      <div style={{ fontSize: 12, color: colors.textSecondary }}>No OG image</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(17, 23, 34, 0.95)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${colors.borderDark}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 64, padding: "0 8px" }}>
          {[
            { icon: LayoutDashboard, label: "Overview", route: "/admin/seo", isMain: false },
            { icon: FileEdit, label: "Editor", route: "/admin/seo/editor", isMain: false },
            { icon: SearchCheck, label: "", route: "/admin/seo/search", isMain: true },
            { icon: BarChart3, label: "Reports", route: "/admin/seo/reports", isMain: false },
            { icon: SettingsIcon, label: "Settings", route: "/admin/seo/settings", isMain: false },
          ].map((item, idx) => {
            const isActive = pathname === item.route;
            
            return item.isMain ? (
              <div key={idx} style={{ position: "relative", top: -20 }}>
                <button 
                  onClick={() => router.push(item.route)}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: colors.primary,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(19, 91, 236, 0.4)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <item.icon style={{ width: 28, height: 28 }} />
                </button>
              </div>
            ) : (
              <button 
                key={idx}
                onClick={() => router.push(item.route)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? colors.primary : colors.textSecondary,
                }}
              >
                <item.icon style={{ width: 24, height: 24 }} />
                <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// New Route Form Component
function NewRouteForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (routePath: string) => void }) {
  const [routePath, setRoutePath] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (routePath.trim()) {
      onSubmit(routePath.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
          Route Path
        </label>
        <input
          type="text"
          value={routePath}
          onChange={(e) => setRoutePath(e.target.value)}
          placeholder="/example-route"
          required
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: colors.backgroundDark,
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8,
            color: "white",
            fontSize: 14,
            outline: "none",
          }}
        />
        <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
          Enter the route path (e.g., /about, /blog/[slug])
        </p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: colors.surfaceDark,
            border: `1px solid ${colors.borderDark}`,
            color: "white",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: colors.primary,
            border: "none",
            color: "white",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Create Route
        </button>
      </div>
    </form>
  );
}
