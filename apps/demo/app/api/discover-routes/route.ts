import { NextResponse } from "next/server";
import { discoverNextJSRoutes } from "@seo-console/package/server";

export async function POST() {
  try {
    const appDir = process.env.NEXT_PUBLIC_APP_DIR || "app";
    const routes = await discoverNextJSRoutes(appDir);

    return NextResponse.json({ routes });
  } catch (error) {
    console.error("Error discovering routes:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to discover routes" },
      { status: 500 }
    );
  }
}
