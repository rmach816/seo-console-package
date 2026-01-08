"use client";

import { useState, useEffect } from "react";
import type { SEORecord } from "../../lib/validation/seo-schema";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { SEORecordForm } from "./SEORecordForm";

export function SEORecordList() {
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/seo-records");
      if (!response.ok) {
        throw new Error("Failed to fetch SEO records");
      }
      const data = await response.json();
      setRecords(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SEO record?")) {
      return;
    }

    try {
      const response = await fetch(`/api/seo-records/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete SEO record");
      }

      await fetchRecords();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete record");
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    fetchRecords();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const editingRecord = editingId
    ? records.find((r) => r.id === editingId) || undefined
    : undefined;

  if (showForm) {
    return (
      <div>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="mb-4"
        >
          ← Back to List
        </Button>
        <SEORecordForm
          record={editingRecord}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading SEO records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        <p>Error: {error}</p>
        <Button onClick={fetchRecords} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">SEO Records</h2>
        <Button onClick={() => setShowForm(true)}>Create New Record</Button>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600 mb-4">No SEO records yet.</p>
            <Button onClick={() => setShowForm(true)}>Create Your First Record</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{record.routePath}</CardTitle>
                    {record.title && (
                      <p className="text-sm text-gray-600 mt-1">{record.title}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => record.id && handleEdit(record.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => record.id && handleDelete(record.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {record.description && (
                    <>
                      <dt className="text-gray-500">Description</dt>
                      <dd className="text-gray-900">{record.description}</dd>
                    </>
                  )}
                  {record.ogType && (
                    <>
                      <dt className="text-gray-500">OG Type</dt>
                      <dd className="text-gray-900">{record.ogType}</dd>
                    </>
                  )}
                  {record.twitterCard && (
                    <>
                      <dt className="text-gray-500">Twitter Card</dt>
                      <dd className="text-gray-900">{record.twitterCard}</dd>
                    </>
                  )}
                  {record.validationStatus && (
                    <>
                      <dt className="text-gray-500">Status</dt>
                      <dd className="text-gray-900">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            record.validationStatus === "valid"
                              ? "bg-green-100 text-green-800"
                              : record.validationStatus === "invalid"
                              ? "bg-red-100 text-red-800"
                              : record.validationStatus === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {record.validationStatus}
                        </span>
                      </dd>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
