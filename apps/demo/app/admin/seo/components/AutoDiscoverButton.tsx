"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle, X } from "lucide-react";
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

interface DiscoveredRoute {
  routePath: string;
  filePath: string;
  isDynamic: boolean;
  isCatchAll: boolean;
  params: string[];
}

interface AutoDiscoverButtonProps {
  onRoutesDiscovered?: (routes: DiscoveredRoute[]) => void;
}

export function AutoDiscoverButton({ onRoutesDiscovered }: AutoDiscoverButtonProps) {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredRoutes, setDiscoveredRoutes] = useState<DiscoveredRoute[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { success, error, info } = useToast();

  const handleDiscover = async () => {
    setIsDiscovering(true);
    setDiscoveredRoutes([]);

    try {
      const response = await fetch("/api/discover-routes", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to discover routes");
      }

      const data = await response.json();
      const routes: DiscoveredRoute[] = data.routes || [];

      if (routes.length === 0) {
        info("No routes found. Make sure you have page.tsx files in your app directory.");
        return;
      }

      setDiscoveredRoutes(routes);
      setShowModal(true);
      onRoutesDiscovered?.(routes);
    } catch (err) {
      console.error("Error discovering routes:", err);
      error("Failed to discover routes. Please try again.");
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleCreateRecords = async (selectedRoutes: DiscoveredRoute[]) => {
    try {
      const response = await fetch("/api/seo-records/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routes: selectedRoutes.map((r) => ({
            routePath: r.routePath,
            title: r.routePath === "/" ? "Home" : r.routePath.replace(/\//g, " ").trim(),
            description: "",
            validationStatus: "pending" as const,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create SEO records");
      }

      success(`Created ${selectedRoutes.length} SEO records successfully!`);
      setShowModal(false);
      setDiscoveredRoutes([]);
      // Refresh page to show new records
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Error creating records:", err);
      error("Failed to create SEO records. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleDiscover}
        disabled={isDiscovering}
        style={{
          padding: "8px 16px",
          backgroundColor: colors.surfaceDark,
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 8,
          color: "white",
          fontSize: 14,
          fontWeight: 500,
          cursor: isDiscovering ? "not-allowed" : "pointer",
          opacity: isDiscovering ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {isDiscovering ? (
          <>
            <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
            Discovering...
          </>
        ) : (
          <>
            <Search style={{ width: 16, height: 16 }} />
            Auto-Discover Routes
          </>
        )}
      </button>

      {showModal && discoveredRoutes.length > 0 && (
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
              maxHeight: "80vh",
              overflow: "auto",
              border: `1px solid ${colors.borderDark}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", margin: 0 }}>Discovered Routes</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textSecondary }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <p style={{ color: colors.textSecondary, marginBottom: 16, fontSize: 14 }}>
              Found {discoveredRoutes.length} routes. Select which ones to create SEO records for:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, maxHeight: 400, overflowY: "auto" }}>
              {discoveredRoutes.map((route, idx) => (
                <label
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    backgroundColor: colors.backgroundDark,
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "white", fontFamily: "monospace" }}>
                      {route.routePath}
                    </div>
                    {route.isDynamic && (
                      <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                        Dynamic route {route.params.length > 0 ? `(${route.params.join(", ")})` : ""}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

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
                onClick={() => {
                  const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
                  const selected = Array.from(checkboxes)
                    .map((cb, idx) => (cb.checked ? discoveredRoutes[idx] : null))
                    .filter((r): r is DiscoveredRoute => r !== null);
                  handleCreateRecords(selected);
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
                Create Selected Records
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
