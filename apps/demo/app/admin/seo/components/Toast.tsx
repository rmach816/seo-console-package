"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
  green: "#0bda5e",
  red: "#ef4444",
  yellow: "#eab308",
};

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colorMap = {
    success: colors.green,
    error: colors.red,
    info: colors.primary,
    warning: colors.yellow,
  };

  const Icon = iconMap[toast.type];
  const color = colorMap[toast.type];

  return (
    <div
      style={{
        backgroundColor: colors.surfaceDark,
        border: `1px solid ${color}40`,
        borderRadius: 8,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 300,
        maxWidth: 500,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <Icon style={{ width: 20, height: 20, color, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 14, color: "white" }}>{toast.message}</div>
      <button
        onClick={() => onClose(toast.id)}
        style={{
          background: "transparent",
          border: "none",
          color: colors.textSecondary,
          cursor: "pointer",
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X style={{ width: 16, height: 16 }} />
      </button>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 16,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <ToastComponent toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info", duration?: number) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string, duration?: number) => showToast(message, "success", duration);
  const error = (message: string, duration?: number) => showToast(message, "error", duration);
  const info = (message: string, duration?: number) => showToast(message, "info", duration);
  const warning = (message: string, duration?: number) => showToast(message, "warning", duration);

  return { toasts, showToast, removeToast, success, error, info, warning };
}
