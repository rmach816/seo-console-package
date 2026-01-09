"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
// Note: Image validation is done server-side via API
// This component only displays the preview and validation results

interface OGImagePreviewProps {
  imageUrl: string;
  expectedWidth?: number;
  expectedHeight?: number;
  title?: string;
  description?: string;
}

type Platform = "facebook" | "twitter" | "linkedin";

export function OGImagePreview({
  imageUrl,
  expectedWidth,
  expectedHeight,
  title,
  description,
}: OGImagePreviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("facebook");
  const [imageError, setImageError] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    issues: Array<{
      field: string;
      severity: "critical" | "warning" | "info";
      message: string;
      expected?: string;
      actual?: string;
    }>;
    metadata?: {
      width: number;
      height: number;
      format: string;
      size?: number;
    };
  } | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      validateImage();
    }
  }, [imageUrl, expectedWidth, expectedHeight]);

  const validateImage = async () => {
    if (!imageUrl) return;

    setValidating(true);
    try {
      // Validate image via API (server-side)
      const response = await fetch("/api/validate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          expectedWidth,
          expectedHeight,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setValidationResult(result);
      }
    } catch {
      // Image validation failed - silently handle
    } finally {
      setValidating(false);
    }
  };

  const platformSpecs = {
    facebook: {
      name: "Facebook",
      width: 1200,
      height: 630,
      aspectRatio: "1.91:1",
      color: "bg-blue-50 border-blue-200",
    },
    twitter: {
      name: "Twitter",
      width: 1200,
      height: 675,
      aspectRatio: "16:9",
      color: "bg-sky-50 border-sky-200",
    },
    linkedin: {
      name: "LinkedIn",
      width: 1200,
      height: 627,
      aspectRatio: "1.91:1",
      color: "bg-blue-50 border-blue-200",
    },
  };

  const spec = platformSpecs[selectedPlatform];

  return (
    <Card>
      <CardHeader>
        <CardTitle>OG Image Preview</CardTitle>
        <CardDescription>
          Preview how your image appears on social platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Selector */}
        <div className="flex gap-2">
          {(["facebook", "twitter", "linkedin"] as Platform[]).map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPlatform === platform
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-pressed={selectedPlatform === platform}
            >
              {platformSpecs[platform].name}
            </button>
          ))}
        </div>

        {/* Platform Specs */}
        <div className={`p-3 rounded-lg border ${spec.color}`}>
          <div className="text-sm">
            <div className="font-medium mb-1">{spec.name} Recommended Size</div>
            <div className="text-gray-600">
              {spec.width} × {spec.height}px ({spec.aspectRatio})
            </div>
          </div>
        </div>

        {/* Image Preview */}
        <div className="relative">
          <div
            className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100"
            style={{
              aspectRatio: `${spec.width} / ${spec.height}`,
              maxWidth: "100%",
            }}
          >
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={title || "OG Image"}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {imageError ? (
                  <div className="text-center p-4">
                    <div className="text-sm font-medium">Image failed to load</div>
                    <div className="text-xs mt-1">Check the URL is accessible</div>
                  </div>
                ) : (
                  <Spinner />
                )}
              </div>
            )}

            {/* Overlay with title/description (simulated social preview) */}
            {title && !imageError && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                {title && (
                  <div className="font-semibold text-sm mb-1 line-clamp-2">{title}</div>
                )}
                {description && (
                  <div className="text-xs opacity-90 line-clamp-2">{description}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Validation Results */}
        {validating && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" />
            <span>Validating image...</span>
          </div>
        )}

        {validationResult && !validating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Validation Status</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  validationResult.isValid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {validationResult.isValid ? "Valid" : "Issues Found"}
              </span>
            </div>

            {validationResult.metadata && (
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  Dimensions: {validationResult.metadata.width} × {validationResult.metadata.height}px
                </div>
                <div>Format: {validationResult.metadata.format.toUpperCase()}</div>
                {validationResult.metadata.size && (
                  <div>Size: {(validationResult.metadata.size / 1024).toFixed(1)} KB</div>
                )}
              </div>
            )}

            {validationResult.issues.length > 0 && (
              <div className="space-y-2 mt-3">
                {validationResult.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-xs border ${
                      issue.severity === "critical"
                        ? "bg-red-50 border-red-200 text-red-800"
                        : issue.severity === "warning"
                        ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                        : "bg-blue-50 border-blue-200 text-blue-800"
                    }`}
                  >
                    <div className="font-medium">{issue.field}</div>
                    <div className="mt-1">{issue.message}</div>
                    {issue.expected && (
                      <div className="mt-1">
                        Expected: <code className="bg-white/50 px-1 rounded">{issue.expected}</code>
                      </div>
                    )}
                    {issue.actual && (
                      <div className="mt-1">
                        Actual: <code className="bg-white/50 px-1 rounded">{issue.actual}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Image URL */}
        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500 mb-1">Image URL</div>
          <div className="text-xs font-mono text-gray-700 break-all">{imageUrl || "No image URL provided"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
