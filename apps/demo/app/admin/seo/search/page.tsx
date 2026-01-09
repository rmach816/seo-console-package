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
  Search,
  CheckCircle,
  AlertTriangle,
  Loader2,
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

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [validating, setValidating] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch("/api/seo-records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleValidate = async (recordId: string) => {
    setValidating(recordId);
    try {
      const response = await fetch(`/api/seo-records/${recordId}/validate`, {
        method: "POST",
      });
      const data = await response.json();
      setValidationResults({ ...validationResults, [recordId]: data });
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setValidating(null);
    }
  };

  const filteredRecords = records.filter((record) =>
    record.routePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 style={{ fontSize: 16, fontWeight: "bold", margin: 0, color: "white" }}>Search &amp; Validate</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: colors.textSecondary }}>
                <span>acme-corp-web</span>
                <ChevronDown style={{ width: 12, height: 12 }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
      <main style={{ padding: "24px 16px 96px" }}>
        {/* Search Bar */}
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 16,
          border: `1px solid ${colors.borderDark}`,
          marginBottom: 24,
        }}>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, color: colors.textSecondary }} />
            <input
              type="text"
              placeholder="Search routes to validate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                backgroundColor: colors.backgroundDark,
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: colors.textSecondary }}>
            <Loader2 style={{ width: 32, height: 32, animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
            Loading routes...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{
            backgroundColor: colors.surfaceDark,
            borderRadius: 12,
            padding: 48,
            border: `1px solid ${colors.borderDark}`,
            textAlign: "center",
            color: colors.textSecondary,
          }}>
            No routes found matching your search.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredRecords.map((record) => {
              if (!record.id) return null;
              const result = validationResults[record.id];
              const statusColor = record.validationStatus === "valid" ? colors.green : record.validationStatus === "invalid" ? colors.red : colors.yellow;
              
              return (
                <div
                  key={record.id}
                  style={{
                    backgroundColor: colors.surfaceDark,
                    borderRadius: 12,
                    padding: 20,
                    border: `1px solid ${colors.borderDark}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 500, marginBottom: 8, color: "white" }}>
                        {record.routePath}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: statusColor }} />
                        <span style={{ fontSize: 12, color: statusColor, textTransform: "capitalize" }}>
                          {record.validationStatus || "unknown"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleValidate(record.id!)}
                      disabled={validating === record.id}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: colors.primary,
                        border: "none",
                        borderRadius: 8,
                        color: "white",
                        fontSize: 14,
                        fontWeight: "bold",
                        cursor: validating === record.id ? "not-allowed" : "pointer",
                        opacity: validating === record.id ? 0.6 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {validating === record.id ? (
                        <>
                          <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                          Validating...
                        </>
                      ) : (
                        "Validate"
                      )}
                    </button>
                  </div>
                  
                  {result && (
                    <div style={{
                      marginTop: 16,
                      padding: 12,
                      backgroundColor: colors.backgroundDark,
                      borderRadius: 8,
                      border: `1px solid ${colors.borderDark}`,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8, color: "white" }}>Validation Results:</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                        {result.valid ? (
                          <div style={{ color: colors.green, display: "flex", alignItems: "center", gap: 4 }}>
                            <CheckCircle style={{ width: 14, height: 14 }} />
                            All checks passed
                          </div>
                        ) : (
                          result.issues?.map((issue: string, idx: number) => (
                            <div key={idx} style={{ color: colors.yellow, display: "flex", alignItems: "center", gap: 4 }}>
                              <AlertTriangle style={{ width: 14, height: 14 }} />
                              {issue}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
