import { NextResponse } from "next/server";
import { getSEORecordById } from "@/lib/database/seo-records";
import { validateURL, validateHTML } from "@/lib/validation/html-validator";
import { validateOGImage } from "@/lib/validation/image-validator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { url, html } = body as { url?: string; html?: string };

    // Get SEO record
    const recordResult = await getSEORecordById(id);
    if (!recordResult.success || !recordResult.data) {
      return NextResponse.json(
        { error: "SEO record not found" },
        { status: 404 }
      );
    }

    const record = recordResult.data;
    const validationResults: Array<{
      type: string;
      result: unknown;
    }> = [];

    // Validate HTML if provided
    if (html) {
      const htmlValidation = await validateHTML(html, record);
      validationResults.push({
        type: "html",
        result: htmlValidation,
      });
    }

    // Validate URL if provided
    if (url) {
      const urlValidation = await validateURL(url, record);
      validationResults.push({
        type: "url",
        result: urlValidation,
      });

      // Also validate OG image if present
      if (record.ogImageUrl) {
        const imageValidation = await validateOGImage(
          record.ogImageUrl,
          record.ogImageWidth || undefined,
          record.ogImageHeight || undefined
        );
        validationResults.push({
          type: "image",
          result: imageValidation,
        });
      }
    }

    return NextResponse.json({
      recordId: id,
      validations: validationResults,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Validation failed",
      },
      { status: 500 }
    );
  }
}
