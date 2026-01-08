"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSEORecordSchema,
  updateSEORecordSchema,
  type CreateSEORecord,
  type UpdateSEORecord,
  type SEORecord,
} from "../../lib/validation/seo-schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { OGImagePreview } from "./OGImagePreview";

interface SEORecordFormProps {
  record?: SEORecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FormData = CreateSEORecord | UpdateSEORecord;

export function SEORecordForm({ record, onSuccess, onCancel }: SEORecordFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!record;

  const schema = isEditing ? updateSEORecordSchema : createSEORecordSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: record
      ? {
          id: record.id,
          routePath: record.routePath,
          title: record.title,
          description: record.description,
          keywords: record.keywords,
          ogTitle: record.ogTitle,
          ogDescription: record.ogDescription,
          ogImageUrl: record.ogImageUrl,
          ogImageWidth: record.ogImageWidth,
          ogImageHeight: record.ogImageHeight,
          ogType: record.ogType,
          ogUrl: record.ogUrl,
          ogSiteName: record.ogSiteName,
          twitterCard: record.twitterCard,
          twitterTitle: record.twitterTitle,
          twitterDescription: record.twitterDescription,
          twitterImageUrl: record.twitterImageUrl,
          twitterSite: record.twitterSite,
          twitterCreator: record.twitterCreator,
          canonicalUrl: record.canonicalUrl,
          robots: record.robots,
          author: record.author,
          publishedTime: record.publishedTime,
          modifiedTime: record.modifiedTime,
        }
      : {
          routePath: "",
        },
  });

  const titleValue = watch("title");
  const descriptionValue = watch("description");
  const ogTitleValue = watch("ogTitle");
  const ogDescriptionValue = watch("ogDescription");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/seo-records/${(data as UpdateSEORecord).id}`
        : "/api/seo-records";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save SEO record");
      }

      onSuccess?.();
      if (!isEditing) {
        reset();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Core SEO metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="routePath" className="block text-sm font-medium text-gray-700 mb-1">
              Route Path <span className="text-red-500">*</span>
            </label>
            <Input
              id="routePath"
              {...register("routePath")}
              placeholder="/about"
              aria-describedby={errors.routePath ? "routePath-error" : undefined}
              aria-invalid={errors.routePath ? "true" : "false"}
            />
            {errors.routePath && (
              <p id="routePath-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.routePath.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Page Title"
              maxLength={60}
              aria-describedby="title-help title-count"
            />
            <div className="flex justify-between mt-1">
              <p id="title-help" className="text-xs text-gray-500">
                Recommended: 50-60 characters
              </p>
              <span id="title-count" className="text-xs text-gray-500" aria-live="polite">
                {titleValue?.length || 0}/60
              </span>
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              placeholder="Page description"
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-describedby="description-help description-count"
            />
            <div className="flex justify-between mt-1">
              <p id="description-help" className="text-xs text-gray-500">
                Recommended: 150-160 characters
              </p>
              <span id="description-count" className="text-xs text-gray-500" aria-live="polite">
                {descriptionValue?.length || 0}/160
              </span>
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Canonical URL
            </label>
            <Input
              id="canonicalUrl"
              type="url"
              {...register("canonicalUrl")}
              placeholder="https://example.com/page"
            />
            {errors.canonicalUrl && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.canonicalUrl.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Open Graph</CardTitle>
          <CardDescription>Social media sharing metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="ogType" className="block text-sm font-medium text-gray-700 mb-1">
              OG Type
            </label>
            <select
              id="ogType"
              {...register("ogType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              <option value="website">Website</option>
              <option value="article">Article</option>
              <option value="product">Product</option>
              <option value="book">Book</option>
              <option value="profile">Profile</option>
              <option value="music">Music</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-700 mb-1">
              OG Title
            </label>
            <Input
              id="ogTitle"
              {...register("ogTitle")}
              placeholder="Open Graph title"
              maxLength={60}
              aria-describedby="ogTitle-count"
            />
            <span id="ogTitle-count" className="text-xs text-gray-500 mt-1 block" aria-live="polite">
              {ogTitleValue?.length || 0}/60
            </span>
          </div>

          <div>
            <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-700 mb-1">
              OG Description
            </label>
            <textarea
              id="ogDescription"
              {...register("ogDescription")}
              rows={3}
              placeholder="Open Graph description"
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-describedby="ogDescription-count"
            />
            <span id="ogDescription-count" className="text-xs text-gray-500 mt-1 block" aria-live="polite">
              {ogDescriptionValue?.length || 0}/200
            </span>
          </div>

          <div>
            <label htmlFor="ogImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              OG Image URL
            </label>
            <Input
              id="ogImageUrl"
              type="url"
              {...register("ogImageUrl")}
              placeholder="https://example.com/image.jpg"
            />
            {errors.ogImageUrl && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.ogImageUrl.message}
              </p>
            )}
            {watch("ogImageUrl") && (
              <div className="mt-4">
                <OGImagePreview
                  imageUrl={watch("ogImageUrl") || ""}
                  expectedWidth={watch("ogImageWidth")}
                  expectedHeight={watch("ogImageHeight")}
                  title={watch("ogTitle") || watch("title")}
                  description={watch("ogDescription") || watch("description")}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ogImageWidth" className="block text-sm font-medium text-gray-700 mb-1">
                OG Image Width
              </label>
              <Input
                id="ogImageWidth"
                type="number"
                {...register("ogImageWidth", { valueAsNumber: true })}
                placeholder="1200"
              />
            </div>
            <div>
              <label htmlFor="ogImageHeight" className="block text-sm font-medium text-gray-700 mb-1">
                OG Image Height
              </label>
              <Input
                id="ogImageHeight"
                type="number"
                {...register("ogImageHeight", { valueAsNumber: true })}
                placeholder="630"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ogSiteName" className="block text-sm font-medium text-gray-700 mb-1">
              OG Site Name
            </label>
            <Input id="ogSiteName" {...register("ogSiteName")} placeholder="Site Name" />
          </div>
        </CardContent>
      </Card>

      {/* Twitter Card */}
      <Card>
        <CardHeader>
          <CardTitle>Twitter Card</CardTitle>
          <CardDescription>Twitter sharing metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="twitterCard" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Card Type
            </label>
            <select
              id="twitterCard"
              {...register("twitterCard")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>

          <div>
            <label htmlFor="twitterTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Title
            </label>
            <Input
              id="twitterTitle"
              {...register("twitterTitle")}
              placeholder="Twitter title"
              maxLength={70}
            />
          </div>

          <div>
            <label htmlFor="twitterDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Description
            </label>
            <textarea
              id="twitterDescription"
              {...register("twitterDescription")}
              rows={3}
              placeholder="Twitter description"
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="twitterImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Image URL
            </label>
            <Input
              id="twitterImageUrl"
              type="url"
              {...register("twitterImageUrl")}
              placeholder="https://example.com/twitter-image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update" : "Create"} SEO Record
        </Button>
      </div>
    </form>
  );
}
