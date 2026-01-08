/**
 * Robots.txt Generator
 * Generates or updates robots.txt with sitemap reference
 */

export interface RobotsTxtOptions {
  userAgents?: Array<{
    agent: string;
    allow?: string[];
    disallow?: string[];
  }>;
  sitemapUrl?: string;
  crawlDelay?: number;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(options: RobotsTxtOptions = {}): string {
  const { userAgents = [], sitemapUrl, crawlDelay } = options;

  let content = "";

  // Default user agent rules
  if (userAgents.length === 0) {
    content += "User-agent: *\n";
    if (crawlDelay) {
      content += `Crawl-delay: ${crawlDelay}\n`;
    }
    content += "Allow: /\n";
    content += "\n";
  } else {
    // Custom user agent rules
    for (const ua of userAgents) {
      content += `User-agent: ${ua.agent}\n`;
      if (crawlDelay) {
        content += `Crawl-delay: ${crawlDelay}\n`;
      }
      if (ua.allow) {
        for (const path of ua.allow) {
          content += `Allow: ${path}\n`;
        }
      }
      if (ua.disallow) {
        for (const path of ua.disallow) {
          content += `Disallow: ${path}\n`;
        }
      }
      content += "\n";
    }
  }

  // Add sitemap reference
  if (sitemapUrl) {
    content += `Sitemap: ${sitemapUrl}\n`;
  }

  return content.trim();
}

/**
 * Update existing robots.txt to include sitemap
 * Preserves existing content
 */
export function updateRobotsTxtWithSitemap(
  existingContent: string,
  sitemapUrl: string
): string {
  // Check if sitemap already exists
  const sitemapRegex = /^Sitemap:\s*.+$/m;
  if (sitemapRegex.test(existingContent)) {
    // Replace existing sitemap line
    return existingContent.replace(sitemapRegex, `Sitemap: ${sitemapUrl}`);
  }

  // Add sitemap at the end
  const trimmed = existingContent.trim();
  return trimmed ? `${trimmed}\n\nSitemap: ${sitemapUrl}` : `Sitemap: ${sitemapUrl}`;
}

/**
 * Extract sitemap URL from robots.txt
 */
export function extractSitemapFromRobotsTxt(content: string): string | null {
  const match = content.match(/^Sitemap:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}
