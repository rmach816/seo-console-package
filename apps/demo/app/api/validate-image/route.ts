import { NextResponse } from "next/server";
import { validateOGImage } from "@seo-console/package/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, expectedWidth, expectedHeight } = body as {
      imageUrl: string;
      expectedWidth?: number;
      expectedHeight?: number;
    };

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const result = await validateOGImage(imageUrl, expectedWidth, expectedHeight);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Validation failed",
      },
      { status: 500 }
    );
  }
}
