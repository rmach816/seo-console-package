import sharp from "sharp";

export interface ImageValidationResult {
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
    size: number;
  };
}

/**
 * Validate OG image URL
 * Checks dimensions, format, file size, and accessibility
 */
export async function validateOGImage(
  imageUrl: string,
  expectedWidth?: number,
  expectedHeight?: number
): Promise<ImageValidationResult> {
  const issues: ImageValidationResult["issues"] = [];

  try {
    // Fetch image
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEO-Console/1.0; +https://example.com/bot)",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout for images
    });

    if (!response.ok) {
      return {
        isValid: false,
        issues: [
          {
            field: "image",
            severity: "critical",
            message: `Failed to fetch image: ${response.status} ${response.statusText}`,
            actual: imageUrl,
          },
        ],
      };
    }

    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Check file size (recommended: < 1MB for OG images)
    const sizeInMB = buffer.length / (1024 * 1024);
    if (sizeInMB > 1) {
      issues.push({
        field: "image",
        severity: "warning",
        message: "Image file size exceeds 1MB recommendation",
        actual: `${sizeInMB.toFixed(2)}MB`,
      });
    }

    // Get image metadata using sharp
    const metadata = await sharp(buffer).metadata();
    const { width, height, format } = metadata;

    if (!width || !height) {
      return {
        isValid: false,
        issues: [
          {
            field: "image",
            severity: "critical",
            message: "Could not determine image dimensions",
            actual: imageUrl,
          },
        ],
      };
    }

    // Validate dimensions
    // Recommended: 1200x630 for OG images
    const recommendedWidth = 1200;
    const recommendedHeight = 630;
    const aspectRatio = width / height;
    const recommendedAspectRatio = recommendedWidth / recommendedHeight;

    if (width < recommendedWidth || height < recommendedHeight) {
      issues.push({
        field: "image",
        severity: "warning",
        message: `Image dimensions below recommended size (${recommendedWidth}x${recommendedHeight})`,
        expected: `${recommendedWidth}x${recommendedHeight}`,
        actual: `${width}x${height}`,
      });
    }

    // Check aspect ratio (should be close to 1.91:1 for OG images)
    if (Math.abs(aspectRatio - recommendedAspectRatio) > 0.1) {
      issues.push({
        field: "image",
        severity: "info",
        message: "Image aspect ratio differs from recommended 1.91:1",
        expected: "1.91:1",
        actual: `${aspectRatio.toFixed(2)}:1`,
      });
    }

    // Validate format (prefer JPEG, PNG, WebP, or AVIF)
    const supportedFormats = ["jpeg", "jpg", "png", "webp", "avif", "gif"];
    if (!format || !supportedFormats.includes(format.toLowerCase())) {
      issues.push({
        field: "image",
        severity: "warning",
        message: "Image format may not be optimal for social sharing",
        expected: "JPEG, PNG, WebP, or AVIF",
        actual: format || "unknown",
      });
    }

    // If expected dimensions provided, validate against them
    if (expectedWidth && width !== expectedWidth) {
      issues.push({
        field: "image",
        severity: "warning",
        message: "Image width does not match expected value",
        expected: `${expectedWidth}px`,
        actual: `${width}px`,
      });
    }

    if (expectedHeight && height !== expectedHeight) {
      issues.push({
        field: "image",
        severity: "warning",
        message: "Image height does not match expected value",
        expected: `${expectedHeight}px`,
        actual: `${height}px`,
      });
    }

    return {
      isValid: issues.filter((i) => i.severity === "critical").length === 0,
      issues,
      metadata: {
        width,
        height,
        format: format || "unknown",
        size: buffer.length,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      issues: [
        {
          field: "image",
          severity: "critical",
          message:
            error instanceof Error
              ? error.message
              : "Failed to validate image",
          actual: imageUrl,
        },
      ],
    };
  }
}

/**
 * Validate image is accessible (returns 200 status)
 */
export async function validateImageAccessibility(
  imageUrl: string
): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, {
      method: "HEAD",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEO-Console/1.0; +https://example.com/bot)",
      },
      signal: AbortSignal.timeout(10000),
    });

    return !!(response.ok && response.headers.get("content-type")?.startsWith("image/"));
  } catch {
    return false;
  }
}
