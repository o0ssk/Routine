"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            // Refetch session every 5 minutes to keep it alive
            refetchInterval={5 * 60}
            // Refetch when window becomes visible
            refetchOnWindowFocus={true}
        >
            <ThemeProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
