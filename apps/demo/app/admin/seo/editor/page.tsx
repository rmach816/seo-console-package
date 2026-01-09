"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  ChevronDown, 
  Bell, 
  LayoutDashboard,
  FileEdit,
  SearchCheck,
  BarChart3,
  Settings as SettingsIcon,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  History,
} from "lucide-react";
import type { SEORecord } from "@seo-console/package";
import { OGImageGenerator } from "../components/OGImageGenerator";

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

export default function EditorPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeParam = searchParams.get("route");
  
  const [allRoutes, setAllRoutes] = useState<SEORecord[]>([]);
  const [record, setRecord] = useState<SEORecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [selectedRoutePath, setSelectedRoutePath] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [changeHistory, setChangeHistory] = useState<Array<{ timestamp: Date; data: typeof formData }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Validation state
  const [validation, setValidation] = useState({
    title: { valid: true, message: "" },
    description: { valid: true, message: "" },
    canonicalUrl: { valid: true, message: "" },
  });
  
  const [formData, setFormData] = useState({
    routePath: "",
    title: "",
    description: "",
    canonicalUrl: "",
    robots: "",
    ogImageUrl: "",
  });

  // Fetch all routes for dropdown
  useEffect(() => {
    fetch("/api/seo-records")
      .then((res) => res.json())
      .then((data) => {
        const routes = data.data || [];
        setAllRoutes(routes);
        
        // If route param exists, select it
        if (routeParam) {
          setSelectedRoutePath(routeParam);
          loadRoute(routeParam, routes);
        } else if (routes.length > 0) {
          // Auto-select first route if no param
          setSelectedRoutePath(routes[0].routePath);
          loadRoute(routes[0].routePath, routes);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [routeParam]);

  const loadRoute = (routePath: string, routes: SEORecord[]) => {
    const foundRoute = routes.find((r) => r.routePath === routePath);
    
    if (foundRoute) {
      setRecord(foundRoute);
      setFormData({
        routePath: foundRoute.routePath || "",
        title: foundRoute.title || "",
        description: foundRoute.description || "",
        canonicalUrl: foundRoute.canonicalUrl || "",
        robots: foundRoute.robots || "",
        ogImageUrl: foundRoute.ogImageUrl || "",
      });
    } else {
      // New route - doesn't exist yet
      setRecord(null);
      setFormData({
        routePath: routePath,
        title: "",
        description: "",
        canonicalUrl: "",
        robots: "",
        ogImageUrl: "",
      });
    }
    setLoading(false);
  };

  const handleRouteSelect = (routePath: string) => {
    setSelectedRoutePath(routePath);
    loadRoute(routePath, allRoutes);
    // Update URL without reload
    router.push(`/admin/seo/editor?route=${encodeURIComponent(routePath)}`, { scroll: false });
  };

  const handleSave = async (isAutoSave = false) => {
    if (saving) return;
    
    setSaving(true);
    if (!isAutoSave) setSaveStatus(null);
    
    try {
      const url = record ? `/api/seo-records/${record.id}` : "/api/seo-records";
      const method = record ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setRecord(data.data);
        }
        // Save to history
        setChangeHistory((prev) => [
          { timestamp: new Date(), data: { ...formData } },
          ...prev.slice(0, 9), // Keep last 10 versions
        ]);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        if (!isAutoSave) {
          setSaveStatus("success");
          setTimeout(() => {
            router.push("/admin/seo");
          }, 1500);
        }
      } else {
        if (!isAutoSave) setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving:", error);
      if (!isAutoSave) setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  // Auto-save with debounce
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (hasUnsavedChanges && formData.routePath) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 2000); // Auto-save after 2 seconds of inactivity
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [formData, hasUnsavedChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave(false);
      }
      // Esc to go back
      if (e.key === "Escape") {
        router.push("/admin/seo");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formData, record]);

  // Real-time validation
  useEffect(() => {
    const newValidation = {
      title: {
        valid: !formData.title || (formData.title.length <= 60),
        message: formData.title.length > 60 
          ? `Title is ${formData.title.length - 60} characters too long (max 60)` 
          : formData.title.length < 30 
          ? "Title should be at least 30 characters for better SEO"
          : "",
      },
      description: {
        valid: !formData.description || (formData.description.length <= 160),
        message: formData.description.length > 160
          ? `Description is ${formData.description.length - 160} characters too long (max 160)`
          : formData.description.length > 0 && formData.description.length < 120
          ? "Description should be 120-160 characters for optimal SEO"
          : "",
      },
      canonicalUrl: {
        valid: !formData.canonicalUrl || /^https?:\/\/.+/.test(formData.canonicalUrl),
        message: formData.canonicalUrl && !/^https?:\/\/.+/.test(formData.canonicalUrl)
          ? "Canonical URL must start with http:// or https://"
          : "",
      },
    };
    setValidation(newValidation);
  }, [formData]);

  const handleValidate = async () => {
    // Validate current form data
    const issues: string[] = [];
    
    if (!formData.title) issues.push("Title is required");
    if (formData.title && formData.title.length > 60) issues.push("Title should be 60 characters or less");
    if (!formData.description) issues.push("Description is required");
    if (formData.description && formData.description.length > 160) issues.push("Description should be 160 characters or less");
    if (!formData.canonicalUrl) issues.push("Canonical URL is recommended");
    
    if (issues.length > 0) {
      alert("Validation Issues:\n" + issues.join("\n"));
    } else {
      alert("✓ All validations passed!");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: colors.backgroundDark,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Loader2 style={{ width: 32, height: 32, animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

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
              <h1 style={{ fontSize: 16, fontWeight: "bold", margin: 0, color: "white" }}>SEO Editor</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: colors.textSecondary }}>
                <span>acme-corp-web</span>
                <ChevronDown style={{ width: 12, height: 12 }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setShowHistory(!showHistory)}
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
                gap: 6,
              }}
            >
              <History style={{ width: 16, height: 16 }} />
              History
            </button>
            <button
              onClick={handleValidate}
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
              Validate
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {hasUnsavedChanges && (
                <span style={{ fontSize: 12, color: colors.yellow }}>
                  Unsaved changes
                </span>
              )}
              {lastSaved && !hasUnsavedChanges && (
                <span style={{ fontSize: 12, color: colors.textSecondary }}>
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {saving && (
                <span style={{ fontSize: 12, color: colors.primary }}>
                  Auto-saving...
                </span>
              )}
            </div>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              style={{
                padding: "8px 16px",
                backgroundColor: colors.primary,
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                fontWeight: "bold",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {saving ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save style={{ width: 16, height: 16 }} />
                  Save
                </>
              )}
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

      {/* Save Status */}
      {saveStatus && (
        <div style={{
          position: "fixed",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "12px 24px",
          backgroundColor: saveStatus === "success" ? colors.green : colors.red,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "white",
          fontSize: 14,
          fontWeight: 500,
        }}>
          {saveStatus === "success" ? (
            <>
              <CheckCircle style={{ width: 16, height: 16 }} />
              Saved successfully!
            </>
          ) : (
            <>
              <AlertCircle style={{ width: 16, height: 16 }} />
              Failed to save. Please try again.
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <main style={{ padding: "24px 16px 96px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${colors.borderDark}`,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>Edit SEO Metadata</h2>
          
          {/* Search Engine Preview */}
          <div style={{
            backgroundColor: colors.backgroundDark,
            borderRadius: 8,
            padding: 20,
            border: `1px solid ${colors.borderDark}`,
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16, color: "white" }}>Search Engine Preview</h3>
            <div style={{
              backgroundColor: "white",
              borderRadius: 4,
              padding: 16,
              maxWidth: 600,
            }}>
              <div style={{ color: "#1a0dab", fontSize: 20, lineHeight: 1.3, marginBottom: 4 }}>
                {formData.title || "Page Title"}
              </div>
              <div style={{ color: "#006621", fontSize: 14, marginBottom: 4 }}>
                {formData.canonicalUrl || "https://example.com" + formData.routePath}
              </div>
              <div style={{ color: "#545454", fontSize: 14, lineHeight: 1.5 }}>
                {formData.description || "Page description will appear here in search results..."}
              </div>
            </div>
            <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 12 }}>
              This is how your page will appear in Google search results
            </p>
          </div>
          
          {/* Route Selector Dropdown */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
              Select Page/Route
            </label>
            <select
              value={selectedRoutePath}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  // New route option selected
                  setSelectedRoutePath("");
                  setRecord(null);
                  setFormData({
                    routePath: "",
                    title: "",
                    description: "",
                    canonicalUrl: "",
                    robots: "",
                    ogImageUrl: "",
                  });
                  router.push("/admin/seo/editor", { scroll: false });
                } else {
                  handleRouteSelect(e.target.value);
                }
              }}
              style={{
                width: "100%",
                padding: 12,
                backgroundColor: colors.backgroundDark,
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                fontFamily: "monospace",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {allRoutes.length === 0 ? (
                <option value="">No routes available</option>
              ) : (
                <>
                  <option value="">-- Select a route --</option>
                  <option value="__new__" style={{ color: colors.primary, fontWeight: "bold" }}>
                    + Create New Route
                  </option>
                  {allRoutes.map((route) => (
                    <option key={route.id} value={route.routePath}>
                      {route.routePath} {route.title ? `(${route.title})` : ""}
                    </option>
                  ))}
                </>
              )}
            </select>
            <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
              Choose a route from your site to edit its SEO metadata
            </p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Route Path */}
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                Route Path
              </label>
              <input
                type="text"
                value={formData.routePath}
                onChange={(e) => {
                  const newPath = e.target.value;
                  setFormData({ ...formData, routePath: newPath });
                  setHasUnsavedChanges(true);
                  // Check if this matches an existing route
                  const matchingRoute = allRoutes.find((r) => r.routePath === newPath);
                  if (matchingRoute) {
                    setSelectedRoutePath(newPath);
                    setRecord(matchingRoute);
            setFormData({
              routePath: matchingRoute.routePath || "",
              title: matchingRoute.title || "",
              description: matchingRoute.description || "",
              canonicalUrl: matchingRoute.canonicalUrl || "",
              robots: matchingRoute.robots || "",
              ogImageUrl: matchingRoute.ogImageUrl || "",
            });
            setHasUnsavedChanges(false);
                  } else if (newPath) {
                    // New route - doesn't exist yet
                    setSelectedRoutePath("");
                    setRecord(null);
                  }
                }}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: colors.backgroundDark,
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  fontFamily: "monospace",
                  outline: "none",
                }}
                placeholder="/example-route"
              />
              <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                You can edit the route path or create a new one by typing here
              </p>
            </div>

            {/* Title */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "white" }}>
                  Meta Title {formData.title && <span style={{ color: colors.textSecondary, fontWeight: 400 }}>({formData.title.length}/60)</span>}
                </label>
                <button
                  onClick={() => {
                    // AI suggestion for title
                    const suggestion = formData.routePath
                      .split("/")
                      .filter(Boolean)
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");
                    setFormData({ ...formData, title: suggestion || "Page Title" });
                    setHasUnsavedChanges(true);
                  }}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: colors.surfaceDark,
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 6,
                    color: colors.textSecondary,
                    fontSize: 11,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  title="AI Suggest Title"
                >
                  <Sparkles style={{ width: 12, height: 12 }} />
                  Suggest
                </button>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                maxLength={60}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: colors.backgroundDark,
                  border: `1px solid ${validation.title.valid ? colors.borderDark : colors.red}`,
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                }}
                placeholder="Page Title"
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <p style={{ fontSize: 12, color: validation.title.valid ? colors.textSecondary : colors.red }}>
                  {validation.title.message || "Recommended: 50-60 characters"}
                </p>
                <span style={{ fontSize: 12, color: formData.title.length > 60 ? colors.red : formData.title.length < 30 ? colors.yellow : colors.textSecondary }}>
                  {formData.title.length}/60
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "white" }}>
                  Meta Description {formData.description && <span style={{ color: colors.textSecondary, fontWeight: 400 }}>({formData.description.length}/160)</span>}
                </label>
                <button
                  onClick={() => {
                    // AI suggestion for description
                    const suggestion = `Learn more about ${formData.routePath.replace(/\//g, " ").trim() || "this page"}. ${formData.title || "Discover valuable information and insights."}`;
                    setFormData({ ...formData, description: suggestion.substring(0, 160) });
                    setHasUnsavedChanges(true);
                  }}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: colors.surfaceDark,
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 6,
                    color: colors.textSecondary,
                    fontSize: 11,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  title="AI Suggest Description"
                >
                  <Sparkles style={{ width: 12, height: 12 }} />
                  Suggest
                </button>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setHasUnsavedChanges(true);
                }}
                maxLength={160}
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: colors.backgroundDark,
                  border: `1px solid ${validation.description.valid ? colors.borderDark : colors.red}`,
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                }}
                placeholder="Page description for search engines"
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <p style={{ fontSize: 12, color: validation.description.valid ? colors.textSecondary : colors.red }}>
                  {validation.description.message || "Recommended: 120-160 characters"}
                </p>
                <span style={{ fontSize: 12, color: formData.description.length > 160 ? colors.red : formData.description.length < 120 ? colors.yellow : colors.textSecondary }}>
                  {formData.description.length}/160
                </span>
              </div>
            </div>

            {/* Canonical URL */}
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                Canonical URL
              </label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => {
                  setFormData({ ...formData, canonicalUrl: e.target.value });
                  setHasUnsavedChanges(true);
                }}
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
                placeholder="https://example.com/page"
              />
            </div>

            {/* Robots */}
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                Robots Meta Tag
              </label>
              <select
                value={formData.robots}
                onChange={(e) => {
                  setFormData({ ...formData, robots: e.target.value });
                  setHasUnsavedChanges(true);
                }}
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
              >
                <option value="">Default (index, follow)</option>
                <option value="index, follow">index, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            {/* OG Image URL */}
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                OG Image URL
              </label>
              <input
                type="url"
                value={formData.ogImageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, ogImageUrl: e.target.value });
                  setHasUnsavedChanges(true);
                }}
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
                placeholder="https://example.com/og-image.jpg"
              />
              {formData.ogImageUrl && (
                <div style={{ marginTop: 8 }}>
                  <img 
                    src={formData.ogImageUrl} 
                    alt="OG Preview" 
                    style={{ maxWidth: "100%", borderRadius: 8, border: `1px solid ${colors.borderDark}` }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
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
