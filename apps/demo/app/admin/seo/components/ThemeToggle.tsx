"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const colors = {
  primary: "#135bec",
  backgroundDark: "#101622",
  surfaceDark: "#192233",
  borderDark: "#324467",
  textSecondary: "#92a4c9",
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = saved || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: `1px solid ${colors.borderDark}`,
        background: colors.surfaceDark,
        cursor: "pointer",
        color: colors.textSecondary,
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun style={{ width: 20, height: 20 }} />
      ) : (
        <Moon style={{ width: 20, height: 20 }} />
      )}
    </button>
  );
}
