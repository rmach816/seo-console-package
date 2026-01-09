"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  ChevronDown, 
  Bell, 
  LayoutDashboard,
  FileEdit,
  SearchCheck,
  BarChart3,
  Settings as SettingsIcon,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Download,
  X,
} from "lucide-react";
import type { SEORecord } from "@seo-console/package";

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

export default function ReportsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    fetch("/api/seo-records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRoutes = records.length;
  const validRoutes = records.filter((r) => r.validationStatus === "valid").length;
  const warningRoutes = records.filter((r) => r.validationStatus === "warning").length;
  const errorRoutes = records.filter((r) => r.validationStatus === "invalid").length;
  
  const issues = [
    { type: "Missing Descriptions", count: records.filter((r) => !r.description).length },
    { type: "Missing Titles", count: records.filter((r) => !r.title).length },
    { type: "Missing Canonical URLs", count: records.filter((r) => !r.canonicalUrl).length },
    { type: "Missing OG Images", count: records.filter((r) => !r.ogImageUrl).length },
    { type: "Titles Too Long", count: records.filter((r) => r.title && r.title.length > 60).length },
  ];

  const handleExport = (format: "csv" | "json" = "csv") => {
    if (format === "csv") {
      const csv = [
        ["Route Path", "Title", "Description", "Status", "Canonical URL", "OG Image", "Robots"],
        ...records.map((r) => [
          r.routePath,
          r.title || "",
          r.description || "",
          r.validationStatus || "",
          r.canonicalUrl || "",
          r.ogImageUrl || "",
          r.robots || "",
        ]),
      ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seo-report-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } else {
      const json = JSON.stringify(records, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seo-report-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    try {
      const data = file.name.endsWith(".json") 
        ? JSON.parse(text)
        : parseCSV(text);
      
      // Import records
      for (const record of data) {
        await fetch("/api/seo-records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      }
      setShowImportModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import. Please check the file format.");
    }
  };

  const parseCSV = (csv: string) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      return {
        routePath: values[0] || "",
        title: values[1] || "",
        description: values[2] || "",
        validationStatus: values[3] || "valid",
        canonicalUrl: values[4] || "",
        ogImageUrl: values[5] || "",
        robots: values[6] || "",
      };
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.backgroundDark,
      color: "white",
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      overflowX: "hidden",
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
            <button
              onClick={() => router.push("/admin/seo")}
              style={{
                background: "transparent",
                border: "none",
                color: colors.textSecondary,
                cursor: "pointer",
                padding: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </button>
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
              <h1 style={{ fontSize: 16, fontWeight: "bold", margin: 0, color: "white" }}>SEO Reports</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: colors.textSecondary }}>
                <span>acme-corp-web</span>
                <ChevronDown style={{ width: 12, height: 12 }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setShowImportModal(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: colors.surfaceDark,
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Import
            </button>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => handleExport("csv")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: colors.surfaceDark,
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Download style={{ width: 16, height: 16 }} />
                Export CSV
              </button>
            </div>
            <button
              onClick={() => handleExport("json")}
              style={{
                padding: "8px 16px",
                backgroundColor: colors.surfaceDark,
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Export JSON
            </button>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "24px 16px 96px", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${colors.borderDark}`,
          }}>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>Total Routes</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "white" }}>{totalRoutes}</div>
          </div>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${colors.borderDark}`,
          }}>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>Valid</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: colors.green }}>{validRoutes}</div>
          </div>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${colors.borderDark}`,
          }}>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>Warnings</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: colors.yellow }}>{warningRoutes}</div>
          </div>
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 20,
            border: `1px solid ${colors.borderDark}`,
          }}>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>Errors</div>
            <div style={{ fontSize: 32, fontWeight: "bold", color: colors.red }}>{errorRoutes}</div>
          </div>
        </div>

        {/* Issues Breakdown */}
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${colors.borderDark}`,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Issues Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {issues.map((issue) => (
              <div key={issue.type} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                backgroundColor: colors.backgroundDark,
                borderRadius: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {issue.count > 0 ? (
                    <AlertTriangle style={{ width: 20, height: 20, color: colors.yellow }} />
                  ) : (
                    <CheckCircle style={{ width: 20, height: 20, color: colors.green }} />
                  )}
                  <span style={{ fontSize: 14, color: "white" }}>{issue.type}</span>
                </div>
                <span style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: issue.count > 0 ? colors.yellow : colors.green,
                }}>
                  {issue.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Integration */}
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${colors.borderDark}`,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Analytics Integration</h2>
          <div style={{
            padding: 20,
            backgroundColor: colors.backgroundDark,
            borderRadius: 8,
            border: `1px dashed ${colors.borderDark}`,
            textAlign: "center",
          }}>
            <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
              Connect Google Search Console to view click-through rates and performance metrics
            </p>
            <button
              onClick={() => {
                // In a real app, this would open OAuth flow
                alert("Google Search Console integration coming soon!");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: colors.primary,
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Connect Google Search Console
            </button>
          </div>
          {records.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>Performance Metrics</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                <div style={{
                  padding: 16,
                  backgroundColor: colors.backgroundDark,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Avg CTR</div>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>2.4%</div>
                </div>
                <div style={{
                  padding: 16,
                  backgroundColor: colors.backgroundDark,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Impressions</div>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>12.5K</div>
                </div>
                <div style={{
                  padding: 16,
                  backgroundColor: colors.backgroundDark,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Clicks</div>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>300</div>
                </div>
                <div style={{
                  padding: 16,
                  backgroundColor: colors.backgroundDark,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Avg Position</div>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>8.2</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${colors.borderDark}`,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Recent Activity</h2>
          <div style={{ color: colors.textSecondary, fontSize: 14 }}>
            {loading ? "Loading..." : "No recent activity to display"}
          </div>
        </div>
      </main>

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
