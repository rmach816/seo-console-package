"use client";

import { useState } from "react";
import { BookOpen, X, ExternalLink, CheckCircle } from "lucide-react";

const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
  green: "#0bda5e",
};

export function SearchEngineRegistrationGuide() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        style={{
          padding: "8px 16px",
          backgroundColor: colors.surfaceDark,
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 8,
          color: "white",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <BookOpen style={{ width: 16, height: 16 }} />
        Search Engine Registration Guide
      </button>

      {showGuide && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setShowGuide(false)}
        >
          <div
            style={{
              backgroundColor: colors.surfaceDark,
              borderRadius: 12,
              padding: 24,
              width: "90%",
              maxWidth: 800,
              maxHeight: "90vh",
              overflow: "auto",
              border: `1px solid ${colors.borderDark}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>Search Engine Registration Guide</h2>
              <button
                onClick={() => setShowGuide(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textSecondary }}
              >
                <X style={{ width: 24, height: 24 }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Google Search Console */}
              <section>
                <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>1. Google Search Console</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 4 }}>Step 1: Create Account</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
                      Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" style={{ color: colors.primary }}>Google Search Console</a> and sign in
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 4 }}>Step 2: Verify Domain</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                      <strong>DNS Verification (Recommended):</strong>
                    </div>
                    <ol style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 20, lineHeight: 1.8 }}>
                      <li>Select "Domain" property type</li>
                      <li>Copy the TXT record from Google</li>
                      <li>Add it to your domain's DNS settings</li>
                      <li>Wait 5-10 minutes, then click "Verify"</li>
                    </ol>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 4 }}>Step 3: Submit Sitemap</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.8 }}>
                      Go to <strong>Sitemaps</strong> → Enter: <code style={{ backgroundColor: colors.backgroundDark, padding: "2px 6px", borderRadius: 4 }}>https://yourdomain.com/sitemap.xml</code> → Click <strong>Submit</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bing Webmaster Tools */}
              <section>
                <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>2. Bing Webmaster Tools</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 4 }}>Step 1: Create Account</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
                      Go to <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" style={{ color: colors.primary }}>Bing Webmaster Tools</a> and sign in
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 4 }}>Step 2: Verify Domain</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                      <strong>Easiest Method - Import from Google:</strong>
                    </div>
                    <ol style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 20, lineHeight: 1.8 }}>
                      <li>Click "Import from Google Search Console"</li>
                      <li>Authorize Bing to access your Google account</li>
                      <li>Select your verified Google property</li>
                      <li>Click "Import" - verification happens automatically!</li>
                    </ol>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 4 }}>Step 3: Submit Sitemap</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.8 }}>
                      Go to <strong>Sitemaps</strong> → Enter: <code style={{ backgroundColor: colors.backgroundDark, padding: "2px 6px", borderRadius: 4 }}>https://yourdomain.com/sitemap.xml</code> → Click <strong>Submit</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Links */}
              <section style={{ padding: 16, backgroundColor: colors.backgroundDark, borderRadius: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 12 }}>Quick Links</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: colors.primary,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                    Google Search Console
                  </a>
                  <a
                    href="https://www.bing.com/webmasters"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: colors.primary,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                    Bing Webmaster Tools
                  </a>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: colors.primary,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                    Your Sitemap
                  </a>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: colors.primary,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                    Your robots.txt
                  </a>
                </div>
              </section>

              {/* Timeline */}
              <section style={{ padding: 16, backgroundColor: colors.backgroundDark, borderRadius: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "white", marginBottom: 12 }}>Timeline Expectations</div>
                <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.8 }}>
                  <div>• <strong>Indexing:</strong> Hours to days</div>
                  <div>• <strong>First impressions:</strong> Days to weeks</div>
                  <div>• <strong>Meaningful rankings:</strong> Weeks to months</div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
