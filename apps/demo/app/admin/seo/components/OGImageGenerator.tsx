"use client";

import { useState } from "react";
import { Download, Sparkles } from "lucide-react";

const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
};

interface OGImageGeneratorProps {
  title: string;
  description: string;
  routePath: string;
  onGenerate: (imageUrl: string) => void;
}

export function OGImageGenerator({ title, description, routePath, onGenerate }: OGImageGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    
    // Create a canvas-based OG image
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, "#135bec");
    gradient.addColorStop(1, "#0a3d91");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // Title
    ctx.fillStyle = "white";
    ctx.font = "bold 64px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, title || routePath, 1000, 64);
    titleLines.forEach((line, i) => {
      ctx.fillText(line, 100, 150 + i * 80);
    });
    
    // Description
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "32px 'Space Grotesk', sans-serif";
    const descLines = wrapText(ctx, description || "SEO optimized page", 1000, 32);
    descLines.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, 100, 350 + i * 45);
    });
    
    // Route path at bottom
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "24px monospace";
    ctx.fillText(routePath, 100, 550);
    
    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        onGenerate(url);
        setGenerating(false);
      }
    }, "image/png");
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const handleDownload = () => {
    if (previewUrl) {
      const a = document.createElement("a");
      a.href = previewUrl;
      a.download = `og-image-${routePath.replace(/\//g, "-")}.png`;
      a.click();
    }
  };

  return (
    <div style={{
      backgroundColor: colors.surfaceDark,
      borderRadius: 8,
      padding: 16,
      border: `1px solid ${colors.borderDark}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: "bold", margin: 0 }}>OG Image Generator</h4>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            padding: "6px 12px",
            backgroundColor: colors.primary,
            border: "none",
            borderRadius: 6,
            color: "white",
            fontSize: 12,
            fontWeight: 500,
            cursor: generating ? "not-allowed" : "pointer",
            opacity: generating ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles style={{ width: 14, height: 14 }} />
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>
      {previewUrl && (
        <div>
          <img 
            src={previewUrl} 
            alt="OG Preview" 
            style={{ 
              width: "100%", 
              borderRadius: 8, 
              border: `1px solid ${colors.borderDark}`,
              marginBottom: 8,
            }} 
          />
          <button
            onClick={handleDownload}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: colors.surfaceDark,
              border: `1px solid ${colors.borderDark}`,
              borderRadius: 6,
              color: "white",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Download style={{ width: 14, height: 14 }} />
            Download Image
          </button>
        </div>
      )}
    </div>
  );
}
