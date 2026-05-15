import type { Metadata } from "next";
import "@/app/globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
	title: "PPT Generator",
	description: "Generate classroom presentations in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
