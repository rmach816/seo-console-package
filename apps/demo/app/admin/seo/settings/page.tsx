"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  ChevronDown, 
  Bell, 
  LayoutDashboard,
  FileEdit,
  SearchCheck,
  BarChart3,
  Settings as SettingsIcon,
  ArrowLeft,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
  green: "#0bda5e",
};

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [settings, setSettings] = useState({
    autoValidate: true,
    autoGenerateOG: true,
    emailNotifications: false,
    slackNotifications: false,
    defaultRobots: "index, follow",
    defaultCanonical: "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings (in real app, would save to API)
    localStorage.setItem("seo-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === "boolean") {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.backgroundDark,
      color: "white",
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      overflowX: "hidden",
    }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(16, 22, 34, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.borderDark}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
            <button
              onClick={() => router.push("/admin/seo")}
              style={{
                background: "transparent",
                border: "none",
                color: colors.textSecondary,
                cursor: "pointer",
                padding: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </button>
            <div style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: colors.primary,
              color: "white",
              fontWeight: "bold",
              fontSize: 14,
              flexShrink: 0,
            }}>
              LE
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <h1 style={{ fontSize: 16, fontWeight: "bold", margin: 0, color: "white" }}>Settings</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: colors.textSecondary }}>
                <span>acme-corp-web</span>
                <ChevronDown style={{ width: 12, height: 12 }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleSave}
              style={{
                padding: "8px 16px",
                backgroundColor: colors.primary,
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: 14,
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Save style={{ width: 16, height: 16 }} />
              {saved ? "Saved!" : "Save"}
            </button>
            <button style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}>
              <Bell style={{ width: 20, height: 20, color: colors.textSecondary }} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "24px 16px 96px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        {/* General Settings */}
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${colors.borderDark}`,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>General Settings</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "white" }}>Auto-validate Routes</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>Automatically validate SEO metadata on save</div>
              </div>
              <button
                onClick={() => handleToggle("autoValidate")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: settings.autoValidate ? colors.primary : colors.textSecondary,
                }}
              >
                {settings.autoValidate ? (
                  <ToggleRight style={{ width: 40, height: 40 }} />
                ) : (
                  <ToggleLeft style={{ width: 40, height: 40 }} />
                )}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "white" }}>Auto-generate OG Images</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>Automatically generate OG images for new routes</div>
              </div>
              <button
                onClick={() => handleToggle("autoGenerateOG")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: settings.autoGenerateOG ? colors.primary : colors.textSecondary,
                }}
              >
                {settings.autoGenerateOG ? (
                  <ToggleRight style={{ width: 40, height: 40 }} />
                ) : (
                  <ToggleLeft style={{ width: 40, height: 40 }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${colors.borderDark}`,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Notifications</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "white" }}>Email Notifications</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>Receive email alerts for critical issues</div>
              </div>
              <button
                onClick={() => handleToggle("emailNotifications")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: settings.emailNotifications ? colors.primary : colors.textSecondary,
                }}
              >
                {settings.emailNotifications ? (
                  <ToggleRight style={{ width: 40, height: 40 }} />
                ) : (
                  <ToggleLeft style={{ width: 40, height: 40 }} />
                )}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "white" }}>Slack Notifications</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>Send alerts to Slack channel</div>
              </div>
              <button
                onClick={() => handleToggle("slackNotifications")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: settings.slackNotifications ? colors.primary : colors.textSecondary,
                }}
              >
                {settings.slackNotifications ? (
                  <ToggleRight style={{ width: 40, height: 40 }} />
                ) : (
                  <ToggleLeft style={{ width: 40, height: 40 }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Default Values */}
        <div style={{
          backgroundColor: colors.surfaceDark,
          borderRadius: 12,
          padding: 24,
          border: `1px solid ${colors.borderDark}`,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Default Values</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                Default Robots Meta
              </label>
              <select
                value={settings.defaultRobots}
                onChange={(e) => setSettings({ ...settings, defaultRobots: e.target.value })}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: colors.backgroundDark,
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                }}
              >
                <option value="index, follow">index, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "white" }}>
                Default Canonical URL Base
              </label>
              <input
                type="text"
                value={settings.defaultCanonical}
                onChange={(e) => setSettings({ ...settings, defaultCanonical: e.target.value })}
                placeholder="https://example.com"
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: colors.backgroundDark,
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 8,
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(17, 23, 34, 0.95)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${colors.borderDark}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 64, padding: "0 8px" }}>
          {[
            { icon: LayoutDashboard, label: "Overview", route: "/admin/seo", isMain: false },
            { icon: FileEdit, label: "Editor", route: "/admin/seo/editor", isMain: false },
            { icon: SearchCheck, label: "", route: "/admin/seo/search", isMain: true },
            { icon: BarChart3, label: "Reports", route: "/admin/seo/reports", isMain: false },
            { icon: SettingsIcon, label: "Settings", route: "/admin/seo/settings", isMain: false },
          ].map((item, idx) => {
            const isActive = pathname === item.route;
            
            return item.isMain ? (
              <div key={idx} style={{ position: "relative", top: -20 }}>
                <button 
                  onClick={() => router.push(item.route)}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: colors.primary,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(19, 91, 236, 0.4)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <item.icon style={{ width: 28, height: 28 }} />
                </button>
              </div>
            ) : (
              <button 
                key={idx}
                onClick={() => router.push(item.route)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  gap: 4,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? colors.primary : colors.textSecondary,
                }}
              >
                <item.icon style={{ width: 24, height: 24 }} />
                <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
