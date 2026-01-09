"use client";

import { useState } from "react";
import { FileText, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "./Toast";

const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
  green: "#0bda5e",
  red: "#ef4444",
};

export function GenerateSitemapButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemapUrl, setSitemapUrl] = useState<string | null>(null);
  const { success, error, info } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSitemapUrl(null);

    try {
      // Generate sitemap via API
      const response = await fetch("/api/generate-sitemap", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate sitemap");
      }

      const data = await response.json();
      const url = data.sitemapUrl || "/sitemap.xml";

      setSitemapUrl(url);
      success("Sitemap generated successfully!");
      info("Don't forget to update your robots.txt to reference the sitemap");

      // Also update robots.txt
      try {
        await fetch("/api/update-robots-txt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sitemapUrl: url }),
        });
        success("robots.txt updated with sitemap reference!");
      } catch (err) {
        console.error("Error updating robots.txt:", err);
        // Non-critical, just log
      }
    } catch (err) {
      console.error("Error generating sitemap:", err);
      error("Failed to generate sitemap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          padding: "8px 16px",
          backgroundColor: colors.surfaceDark,
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 8,
          color: "white",
          fontSize: 14,
          fontWeight: 500,
          cursor: isGenerating ? "not-allowed" : "pointer",
          opacity: isGenerating ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {isGenerating ? (
          <>
            <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
            Generating...
          </>
        ) : (
          <>
            <FileText style={{ width: 16, height: 16 }} />
            Generate Sitemap
          </>
        )}
      </button>
      {sitemapUrl && (
        <a
          href={sitemapUrl}
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
          <ExternalLink style={{ width: 12, height: 12 }} />
          View sitemap.xml
        </a>
      )}
    </div>
  );
}
