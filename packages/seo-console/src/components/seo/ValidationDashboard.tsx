"use client";

import { useState, useEffect } from "react";
import type { SEORecord } from "../../lib/validation/seo-schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

// Note: Link component should be provided by the consuming Next.js app
// Using a simple anchor tag as fallback for package compatibility
const Link = ({ href, children, ...props }: { href: string; children?: React.ReactNode; className?: string; [key: string]: unknown }) => {
   
  return <a href={href} {...(props as any)}>{children as any}</a>;
};

interface ValidationIssue {
  field: string;
  severity: "critical" | "warning" | "info";
  message: string;
  expected?: string;
  actual?: string;
}

interface ValidationResult {
  type: string;
  result: {
    isValid: boolean;
    issues: ValidationIssue[];
    validatedAt?: string;
    metadata?: {
      width?: number;
      height?: number;
      format?: string;
      size?: number;
    };
  };
}

interface ValidationResponse {
  recordId: string;
  validations: ValidationResult[];
}

export function ValidationDashboard() {
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState<Record<string, boolean>>({});
  const [validationResults, setValidationResults] = useState<
    Record<string, ValidationResponse>
  >({});

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seo-records");
      if (response.ok) {
        const data = await response.json();
        setRecords(data.data || []);
      }
    } catch {
      // Failed to fetch records - silently handle
    } finally {
      setLoading(false);
    }
  };

  const validateRecord = async (record: SEORecord) => {
    if (!record.id) return;

    setValidating((prev) => ({ ...prev, [record.id!]: true }));

    try {
      // For now, we'll validate using the canonical URL or construct a URL
      // In a real scenario, you'd have the actual site URL
      const url = record.canonicalUrl || `https://example.com${record.routePath}`;

      const response = await fetch(`/api/seo-records/${record.id}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data: ValidationResponse = await response.json();
        setValidationResults((prev) => ({
          ...prev,
          [record.id!]: data,
        }));

        // Update validation status in database
        const allIssues = data.validations.flatMap((v) => v.result.issues);
        const hasCritical = allIssues.some((i) => i.severity === "critical");
        const hasWarnings = allIssues.some((i) => i.severity === "warning");
        
        const validationStatus = hasCritical
          ? "invalid"
          : hasWarnings
          ? "warning"
          : "valid";

        await fetch(`/api/seo-records/${record.id}/update-validation`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            validationStatus,
            validationErrors: allIssues.reduce((acc, issue) => {
              acc[issue.field] = issue;
              return acc;
            }, {} as Record<string, unknown>),
            lastValidatedAt: new Date().toISOString(),
          }),
        });

        // Refresh records to show updated status
        fetchRecords();
      }
    } catch {
      // Validation failed - silently handle
    } finally {
      setValidating((prev) => ({ ...prev, [record.id!]: false }));
    }
  };

  const getSeverityColor = (severity: ValidationIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: ValidationIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "•";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Spinner />
        <p className="text-gray-600 mt-4">Loading records...</p>
      </div>
    );
  }

  const allIssues: Array<{
    record: SEORecord;
    issue: ValidationIssue;
    validationType: string;
  }> = [];

  // Collect all issues from validation results
  Object.entries(validationResults).forEach(([recordId, validation]) => {
    const record = records.find((r) => r.id === recordId);
    if (record) {
      validation.validations.forEach((val) => {
        val.result.issues.forEach((issue) => {
          allIssues.push({
            record,
            issue,
            validationType: val.type,
          });
        });
      });
    }
  });

  const criticalIssues = allIssues.filter((i) => i.issue.severity === "critical");
  const warningIssues = allIssues.filter((i) => i.issue.severity === "warning");
  const infoIssues = allIssues.filter((i) => i.issue.severity === "info");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Validation Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Validate your SEO records against live pages
          </p>
        </div>
        <Button onClick={fetchRecords} variant="outline">
          Refresh Records
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{records.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Records</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{criticalIssues.length}</div>
              <div className="text-sm text-gray-600 mt-1">Critical Issues</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{warningIssues.length}</div>
              <div className="text-sm text-gray-600 mt-1">Warnings</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{infoIssues.length}</div>
              <div className="text-sm text-gray-600 mt-1">Info</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">SEO Records</h3>
        {records.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">No SEO records found.</p>
              <Link href="/dashboard">
                <Button className="mt-4">Create Your First Record</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => {
            const result = record.id ? validationResults[record.id] : undefined;
            const hasIssues = result?.validations.some((v) => v.result.issues.length > 0);

            return (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{record.routePath}</CardTitle>
                      {record.title && (
                        <CardDescription className="mt-1">{record.title}</CardDescription>
                      )}
                    </div>
                    <Button
                      onClick={() => validateRecord(record)}
                      disabled={validating[record.id!]}
                      size="sm"
                    >
                      {validating[record.id!] ? (
                        <>
                          <Spinner className="mr-2" />
                          Validating...
                        </>
                      ) : (
                        "Validate"
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {result && (
                  <CardContent>
                    <div className="space-y-4">
                      {result.validations.map((validation, idx) => (
                        <div key={idx} className="border-t pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm text-gray-700">
                              {validation.type.toUpperCase()} Validation
                            </span>
                            {validation.result.isValid ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Valid
                              </span>
                            ) : (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Issues Found
                              </span>
                            )}
                          </div>
                          {validation.result.issues.length > 0 && (
                            <div className="space-y-2">
                              {validation.result.issues.map((issue, issueIdx) => (
                                <div
                                  key={issueIdx}
                                  className={`p-3 rounded border ${getSeverityColor(issue.severity)}`}
                                >
                                  <div className="flex items-start gap-2">
                                    <span>{getSeverityIcon(issue.severity)}</span>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{issue.field}</div>
                                      <div className="text-sm mt-1">{issue.message}</div>
                                      {issue.expected && (
                                        <div className="text-xs mt-1">
                                          Expected: <code className="bg-white/50 px-1 rounded">{issue.expected}</code>
                                        </div>
                                      )}
                                      {issue.actual && (
                                        <div className="text-xs mt-1">
                                          Actual: <code className="bg-white/50 px-1 rounded">{issue.actual}</code>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {validation.result.metadata && (
                            <div className="mt-2 text-xs text-gray-600">
                              Image: {validation.result.metadata.width}x{validation.result.metadata.height} ({validation.result.metadata.format}{validation.result.metadata.size ? `, ${(validation.result.metadata.size / 1024).toFixed(1)}KB` : ""})
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {hasIssues && (
                      <div className="mt-4">
                        <Link href={`/dashboard?edit=${record.id}`}>
                          <Button variant="outline" size="sm">
                            Edit Record
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
