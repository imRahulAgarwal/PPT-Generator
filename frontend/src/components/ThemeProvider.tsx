"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Wraps the app with next-themes for dark/light mode support
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			{children}
		</NextThemesProvider>
	);
}
