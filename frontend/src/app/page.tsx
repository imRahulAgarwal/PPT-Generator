import KpiCards from "@/components/KpiCards";
import PptForm from "@/components/PptForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
	return (
		<main className="min-h-screen bg-background px-6 py-10 flex flex-col items-center">
			{/* Header */}
			<header className="w-full max-w-5xl flex justify-between items-baseline mb-10">
				<div>
					<h1 className="font-display text-2xl text-primary">PPT Generator</h1>
					<p className="text-sm text-secondary mt-1">AI-powered presentations for teachers</p>
				</div>
				<ThemeToggle />
			</header>

			<div className="w-full max-w-5xl flex flex-col-reverse gap-8 md:flex-row md:items-start">
				{/* KPI cards column */}
				<section className="w-full md:w-[55%]">
					<h2 className="text-xs font-medium text-secondary uppercase tracking-wide mb-3">Usage Stats</h2>
					<KpiCards />
				</section>

				{/* Form column */}
				<section className="w-full md:w-[45%]">
					<h2 className="text-xs font-medium text-secondary uppercase tracking-wide mb-3">
						New Presentation
					</h2>
					<PptForm />
				</section>
			</div>
		</main>
	);
}
