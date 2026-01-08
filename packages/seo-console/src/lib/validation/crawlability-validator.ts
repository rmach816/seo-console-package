/**
 * Crawlability Validator
 * Validates that search engines can crawl and index pages
 */

import { extractMetadataFromHTML } from "../metadata-extractor";

export interface CrawlabilityResult {
  crawlable: boolean;
  indexable: boolean;
  issues: CrawlabilityIssue[];
  warnings: CrawlabilityIssue[];
}

export interface CrawlabilityIssue {
  type: "noindex" | "nofollow" | "robots_blocked" | "auth_wall" | "redirect_loop" | "404" | "canonical_missing";
  severity: "error" | "warning";
  message: string;
  page: string;
}

/**
 * Validate that a page is crawlable and indexable
 */
export async function validateCrawlability(
  url: string,
  html?: string
): Promise<CrawlabilityResult> {
  const issues: CrawlabilityIssue[] = [];
  const warnings: CrawlabilityIssue[] = [];

  try {
    // Fetch page if HTML not provided
    if (!html) {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SEO-Console-Bot/1.0",
        },
        redirect: "follow",
      });

      // Check HTTP status
      if (response.status === 404) {
        issues.push({
          type: "404",
          severity: "error",
          message: "Page returns 404 Not Found",
          page: url,
        });
        return {
          crawlable: false,
          indexable: false,
          issues,
          warnings,
        };
      }

      if (response.status !== 200) {
        issues.push({
          type: "404",
          severity: "error",
          message: `Page returns HTTP ${response.status}`,
          page: url,
        });
      }

      // Check for authentication wall
      if (response.status === 401 || response.status === 403) {
        issues.push({
          type: "auth_wall",
          severity: "error",
          message: "Page requires authentication (401/403)",
          page: url,
        });
      }

      html = await response.text();
    }

    // Parse HTML
    const metadata = extractMetadataFromHTML(html, url);

    // Check robots meta tag
    if (metadata.robots) {
      const robots = metadata.robots.toLowerCase();
      
      if (robots.includes("noindex")) {
        issues.push({
          type: "noindex",
          severity: "error",
          message: "Page has noindex meta tag - will not be indexed",
          page: url,
        });
      }

      if (robots.includes("nofollow")) {
        warnings.push({
          type: "nofollow",
          severity: "warning",
          message: "Page has nofollow meta tag - links won't be followed",
          page: url,
        });
      }
    }

    // Check for canonical URL
    if (!metadata.canonicalUrl) {
      warnings.push({
        type: "canonical_missing",
        severity: "warning",
        message: "Page missing canonical URL",
        page: url,
      });
    }

    // Check for redirect loops (would need to track redirects)
    // This is handled by fetch with redirect: "follow"

    return {
      crawlable: issues.filter((i) => i.type !== "noindex").length === 0,
      indexable: !issues.some((i) => i.type === "noindex"),
      issues,
      warnings,
    };
  } catch (error) {
    issues.push({
      type: "404",
      severity: "error",
      message: error instanceof Error ? error.message : "Failed to fetch page",
      page: url,
    });

    return {
      crawlable: false,
      indexable: false,
      issues,
      warnings,
    };
  }
}

/**
 * Validate robots.txt allows crawling
 */
export async function validateRobotsTxt(
  baseUrl: string,
  routePath: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();
    const response = await fetch(robotsUrl);

    if (!response.ok) {
      return { allowed: true, reason: "robots.txt not found (default: allow all)" };
    }

    const robotsTxt = await response.text();
    const lines = robotsTxt.split("\n").map((l) => l.trim());

    let currentUserAgent = "*";
    let isAllowed = true;

    for (const line of lines) {
      if (line.startsWith("#") || !line) continue;

      const [directive, ...valueParts] = line.split(":").map((s) => s.trim());
      const value = valueParts.join(":").trim();

      if (directive.toLowerCase() === "user-agent") {
        currentUserAgent = value;
      } else if (directive.toLowerCase() === "disallow") {
        if (currentUserAgent === "*" || currentUserAgent.toLowerCase() === "googlebot") {
          if (value === "/") {
            isAllowed = false;
            return { allowed: false, reason: "robots.txt disallows all pages" };
          } else if (routePath.startsWith(value)) {
            isAllowed = false;
            return { allowed: false, reason: `robots.txt disallows ${routePath}` };
          }
        }
      } else if (directive.toLowerCase() === "allow") {
        if (value === "/" || routePath.startsWith(value)) {
          isAllowed = true;
        }
      }
    }

    return { allowed: isAllowed };
  } catch (error) {
    // If robots.txt can't be fetched, assume allowed
    return { allowed: true, reason: "Could not fetch robots.txt" };
  }
}

/**
 * Check if site is publicly accessible (no auth wall)
 */
export async function validatePublicAccess(url: string): Promise<{ accessible: boolean; requiresAuth: boolean }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SEO-Console-Bot/1.0",
      },
    });

    const requiresAuth = response.status === 401 || response.status === 403;
    const accessible = response.ok && !requiresAuth;

    return { accessible, requiresAuth };
  } catch {
    return { accessible: false, requiresAuth: false };
  }
}
