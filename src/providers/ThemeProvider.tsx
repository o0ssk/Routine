"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
    const [mounted, setMounted] = useState(false);

    // Get system preference
    const getSystemTheme = useCallback((): "light" | "dark" => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "dark";
    }, []);

    // Apply theme to DOM
    const applyTheme = useCallback((newTheme: Theme) => {
        const root = document.documentElement;
        let resolved: "light" | "dark";

        if (newTheme === "system") {
            resolved = getSystemTheme();
            // Remove manual classes, let media query handle it
            root.classList.remove("light", "dark");
        } else {
            resolved = newTheme;
            root.classList.remove("light", "dark");
            root.classList.add(newTheme);
        }

        setResolvedTheme(resolved);
    }, [getSystemTheme]);

    // Set theme and persist
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        applyTheme(newTheme);

        // Save to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", newTheme);
        }

        // Save to database (fire and forget)
        fetch("/api/user/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme: newTheme }),
        }).catch(() => {
            // Ignore errors - localStorage is the primary persistence
        });
    }, [applyTheme]);

    // Initialize on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const initialTheme = savedTheme || "system";

        setThemeState(initialTheme);
        applyTheme(initialTheme);
        setMounted(true);
    }, [applyTheme]);

    // Listen for system theme changes when in "system" mode
    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            setResolvedTheme(getSystemTheme());
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, getSystemTheme]);

    // Prevent flash by not rendering until mounted
    if (!mounted) {
        return (
            <ThemeContext.Provider value={{ theme: "system", resolvedTheme: "dark", setTheme: () => { } }}>
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
