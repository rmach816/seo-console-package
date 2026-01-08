/**
 * Route Discovery Utility
 * Automatically discovers Next.js routes from the file system
 */

import { promises as fs } from "fs";
import { join, relative, dirname } from "path";
import { glob } from "glob";

export interface DiscoveredRoute {
  routePath: string;
  filePath: string;
  isDynamic: boolean;
  isCatchAll: boolean;
  params: string[];
}

/**
 * Discover all Next.js routes from the app directory
 */
export async function discoverNextJSRoutes(
  appDir: string = "app",
  rootDir: string = process.cwd()
): Promise<DiscoveredRoute[]> {
  const routes: DiscoveredRoute[] = [];
  const appPath = join(rootDir, appDir);

  try {
    // Find all page.tsx files
    const pageFiles = await glob("**/page.tsx", {
      cwd: appPath,
      absolute: false,
      ignore: ["**/node_modules/**", "**/.next/**"],
    });

    for (const file of pageFiles) {
      const route = fileToRoute(file, appDir);
      if (route) {
        routes.push(route);
      }
    }
  } catch (error) {
    console.error("Error discovering routes:", error);
  }

  return routes;
}

/**
 * Convert file path to route path
 */
function fileToRoute(filePath: string, appDir: string): DiscoveredRoute | null {
  // Remove app/ prefix and /page.tsx suffix
  let routePath = filePath
    .replace(/^app\//, "")
    .replace(/\/page\.tsx$/, "")
    .replace(/\/page$/, "");

  // Handle root route
  if (routePath === "page" || routePath === "") {
    routePath = "/";
  } else {
    routePath = "/" + routePath;
  }

  // Detect dynamic segments
  const segments = routePath.split("/").filter(Boolean);
  const params: string[] = [];
  let isDynamic = false;
  let isCatchAll = false;

  for (const segment of segments) {
    if (segment.startsWith("[...") && segment.endsWith("]")) {
      // Catch-all route: [...slug]
      const param = segment.slice(4, -1);
      params.push(param);
      isDynamic = true;
      isCatchAll = true;
    } else if (segment.startsWith("[") && segment.endsWith("]")) {
      // Dynamic route: [slug]
      const param = segment.slice(1, -1);
      params.push(param);
      isDynamic = true;
    }
  }

  return {
    routePath,
    filePath: join(appDir, filePath),
    isDynamic,
    isCatchAll,
    params,
  };
}

/**
 * Generate example route paths for dynamic routes
 * Useful for creating sample SEO records
 */
export function generateExamplePaths(route: DiscoveredRoute, count: number = 3): string[] {
  if (!route.isDynamic) {
    return [route.routePath];
  }

  const examples: string[] = [];
  const segments = route.routePath.split("/").filter(Boolean);

  for (let i = 0; i < count; i++) {
    let examplePath = "";
    for (const segment of segments) {
      if (segment.startsWith("[...")) {
        // Catch-all: use multiple segments
        examplePath += `/example-${i}-part-1/example-${i}-part-2`;
      } else if (segment.startsWith("[")) {
        // Dynamic: use example value
        examplePath += `/example-${i}`;
      } else {
        examplePath += `/${segment}`;
      }
    }
    examples.push(examplePath || "/");
  }

  return examples;
}
