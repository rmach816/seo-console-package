import * as cheerio from "cheerio";
import type { SEORecord } from "@/lib/validation/seo-schema";

export type ValidationSeverity = "critical" | "warning" | "info";

export interface ValidationIssue {
  field: string;
  severity: ValidationSeverity;
  message: string;
  expected?: string;
  actual?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  validatedAt: Date;
}

/**
 * Validate HTML content against SEO record requirements
 */
export async function validateHTML(
  html: string,
  record: SEORecord,
  _baseUrl?: string
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];
  const $ = cheerio.load(html);

  // Validate title
  const title = $("title").text().trim();
  if (record.title) {
    if (!title) {
      issues.push({
        field: "title",
        severity: "critical",
        message: "Title tag is missing",
        expected: record.title,
      });
    } else if (title !== record.title) {
      issues.push({
        field: "title",
        severity: "warning",
        message: "Title tag does not match SEO record",
        expected: record.title,
        actual: title,
      });
    }
    if (title.length > 60) {
      issues.push({
        field: "title",
        severity: "warning",
        message: "Title exceeds recommended 60 characters",
        actual: `${title.length} characters`,
      });
    }
  }

  // Validate meta description
  const metaDescription = $('meta[name="description"]').attr("content")?.trim();
  if (record.description) {
    if (!metaDescription) {
      issues.push({
        field: "description",
        severity: "critical",
        message: "Meta description is missing",
        expected: record.description,
      });
    } else if (metaDescription !== record.description) {
      issues.push({
        field: "description",
        severity: "warning",
        message: "Meta description does not match SEO record",
        expected: record.description,
        actual: metaDescription,
      });
    }
    if (metaDescription && metaDescription.length > 160) {
      issues.push({
        field: "description",
        severity: "warning",
        message: "Description exceeds recommended 160 characters",
        actual: `${metaDescription.length} characters`,
      });
    }
  }

  // Validate Open Graph tags
  if (record.ogTitle || record.ogDescription || record.ogImageUrl) {
    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogDescription = $('meta[property="og:description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    const ogType = $('meta[property="og:type"]').attr("content");
    const ogUrl = $('meta[property="og:url"]').attr("content");

    if (record.ogTitle && !ogTitle) {
      issues.push({
        field: "og:title",
        severity: "critical",
        message: "Open Graph title is missing",
        expected: record.ogTitle,
      });
    }

    if (record.ogDescription && !ogDescription) {
      issues.push({
        field: "og:description",
        severity: "warning",
        message: "Open Graph description is missing",
        expected: record.ogDescription,
      });
    }

    if (record.ogImageUrl && !ogImage) {
      issues.push({
        field: "og:image",
        severity: "critical",
        message: "Open Graph image is missing",
        expected: record.ogImageUrl,
      });
    }

    if (record.ogType && ogType !== record.ogType) {
      issues.push({
        field: "og:type",
        severity: "warning",
        message: "Open Graph type does not match",
        expected: record.ogType,
        actual: ogType,
      });
    }

    if (record.ogUrl && ogUrl !== record.ogUrl) {
      issues.push({
        field: "og:url",
        severity: "warning",
        message: "Open Graph URL does not match",
        expected: record.ogUrl,
        actual: ogUrl,
      });
    }
  }

  // Validate Twitter Card tags
  if (record.twitterCard || record.twitterTitle || record.twitterImageUrl) {
    const twitterCard = $('meta[name="twitter:card"]').attr("content");
    const twitterTitle = $('meta[name="twitter:title"]').attr("content");
    const _twitterDescription = $('meta[name="twitter:description"]').attr("content");
    const twitterImage = $('meta[name="twitter:image"]').attr("content");

    if (record.twitterCard && twitterCard !== record.twitterCard) {
      issues.push({
        field: "twitter:card",
        severity: "warning",
        message: "Twitter card type does not match",
        expected: record.twitterCard,
        actual: twitterCard,
      });
    }

    if (record.twitterTitle && !twitterTitle) {
      issues.push({
        field: "twitter:title",
        severity: "warning",
        message: "Twitter title is missing",
        expected: record.twitterTitle,
      });
    }

    if (record.twitterImageUrl && !twitterImage) {
      issues.push({
        field: "twitter:image",
        severity: "warning",
        message: "Twitter image is missing",
        expected: record.twitterImageUrl,
      });
    }
  }

  // Validate canonical URL
  if (record.canonicalUrl) {
    const canonical = $('link[rel="canonical"]').attr("href");
    if (!canonical) {
      issues.push({
        field: "canonical",
        severity: "critical",
        message: "Canonical URL is missing",
        expected: record.canonicalUrl,
      });
    } else if (canonical !== record.canonicalUrl) {
      issues.push({
        field: "canonical",
        severity: "warning",
        message: "Canonical URL does not match",
        expected: record.canonicalUrl,
        actual: canonical,
      });
    }

    // Validate canonical is absolute
    if (canonical && !canonical.startsWith("http://") && !canonical.startsWith("https://")) {
      issues.push({
        field: "canonical",
        severity: "warning",
        message: "Canonical URL should be absolute",
        actual: canonical,
      });
    }
  }

  // Check for duplicate titles (across the site - would need multiple HTML files)
  // This is a placeholder for future enhancement

  return {
    isValid: issues.filter((i) => i.severity === "critical").length === 0,
    issues,
    validatedAt: new Date(),
  };
}

/**
 * Fetch HTML from a URL and validate it
 */
export async function validateURL(
  url: string,
  record: SEORecord
): Promise<ValidationResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEO-Console/1.0; +https://example.com/bot)",
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        isValid: false,
        issues: [
          {
            field: "fetch",
            severity: "critical",
            message: `Failed to fetch URL: ${response.status} ${response.statusText}`,
            actual: url,
          },
        ],
        validatedAt: new Date(),
      };
    }

    const html = await response.text();
    return validateHTML(html, record, url);
  } catch (error) {
    return {
      isValid: false,
      issues: [
        {
          field: "fetch",
          severity: "critical",
          message: error instanceof Error ? error.message : "Failed to fetch URL",
          actual: url,
        },
      ],
      validatedAt: new Date(),
    };
  }
}
