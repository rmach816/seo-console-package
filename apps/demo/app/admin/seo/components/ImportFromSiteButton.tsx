"use client";

import { useState } from "react";
import { Download, Loader2, X, CheckCircle } from "lucide-react";
import { useToast } from "./Toast";

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

interface ImportFromSiteButtonProps {
  onImportComplete?: () => void;
}

export function ImportFromSiteButton({ onImportComplete }: ImportFromSiteButtonProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [routes, setRoutes] = useState<string[]>([]);
  const [importResults, setImportResults] = useState<Array<{ route: string; success: boolean; error?: string }>>([]);
  const { success, error, info } = useToast();

  const handleImport = async () => {
    if (!baseUrl.trim()) {
      error("Please enter a base URL");
      return;
    }

    setIsImporting(true);
    setImportResults([]);

    try {
      const routesToImport = routes.length > 0 ? routes : ["/"];

      const response = await fetch("/api/import-from-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: baseUrl.trim(),
          routes: routesToImport,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to import from site");
      }

      const data = await response.json();
      setImportResults(data.results || []);

      const successCount = data.results?.filter((r: any) => r.success).length || 0;
      if (successCount > 0) {
        success(`Successfully imported ${successCount} routes!`);
        onImportComplete?.();
        setTimeout(() => {
          setShowModal(false);
          window.location.reload();
        }, 2000);
      } else {
        error("No routes were imported. Check if the URLs are accessible.");
      }
    } catch (err) {
      console.error("Error importing from site:", err);
      error("Failed to import from site. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
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
        Import from Site
      </button>

      {showModal && (
        <div
          style={{
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
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: colors.surfaceDark,
              borderRadius: 12,
              padding: 24,
              width: "90%",
              maxWidth: 600,
              border: `1px solid ${colors.borderDark}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>Import SEO from Site</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textSecondary }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                  Base URL
                </label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://example.com"
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
              </div>

              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                  Routes to Import (one per line, leave empty to import homepage only)
                </label>
                <textarea
                  value={routes.join("\n")}
                  onChange={(e) => setRoutes(e.target.value.split("\n").filter(Boolean))}
                  placeholder="/&#10;/about&#10;/blog"
                  rows={6}
                  style={{
                    width: "100%",
                    padding: 12,
                    backgroundColor: colors.backgroundDark,
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 8,
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              {importResults.length > 0 && (
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>Import Results:</div>
                  {importResults.map((result, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: 8,
                        backgroundColor: colors.backgroundDark,
                        borderRadius: 6,
                        marginBottom: 4,
                      }}
                    >
                      {result.success ? (
                        <CheckCircle style={{ width: 16, height: 16, color: colors.green }} />
                      ) : (
                        <X style={{ width: 16, height: 16, color: colors.red }} />
                      )}
                      <span style={{ fontSize: 12, color: result.success ? colors.green : colors.red, fontFamily: "monospace" }}>
                        {result.route}
                      </span>
                      {result.error && <span style={{ fontSize: 11, color: colors.textSecondary }}>({result.error})</span>}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: colors.surfaceDark,
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 8,
                    color: "white",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={isImporting || !baseUrl.trim()}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: colors.primary,
                    border: "none",
                    borderRadius: 8,
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                    cursor: isImporting ? "not-allowed" : "pointer",
                    opacity: isImporting || !baseUrl.trim() ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {isImporting ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download style={{ width: 16, height: 16 }} />
                      Import
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
