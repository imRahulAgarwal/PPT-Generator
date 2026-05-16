"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	// Avoid hydration mismatch by only rendering after mount
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const isDark = resolvedTheme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="text-xs text-secondary hover:text-primary border border-border hover:border-secondary rounded-lg px-3 py-1.5 bg-transparent transition-colors cursor-pointer"
			aria-label="Toggle theme">
			{isDark ? "☀ Light" : "☾ Dark"}
		</button>
	);
}
