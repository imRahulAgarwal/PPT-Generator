import PptForm from "@/components/PptForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
	return (
		<main className="page-shell">
			<div className="page-header">
				<div>
					<h1 className="page-title">SlideForge</h1>
					<p className="page-subtitle">PPT generator for teachers</p>
				</div>
				<ThemeToggle />
			</div>
			<PptForm />
		</main>
	);
}
