"use client";

import { useEffect, useState } from "react";

interface Metrics {
	totalCost: number;
	totalInputTokens: number;
	totalOutputTokens: number;
	totalTokens: number;
	totalContentGenerated: number;
	totalCacheHits: number;
	costSavedByCaching: number;
	averageCost: number;
	averageContentGenerationTimeMs: number;
	totalFailures: number;
}

interface KpiCardProps {
	label: string;
	value: string;
	description: string;
}

// Single KPI tile
function KpiCard({ label, value, description }: KpiCardProps) {
	return (
		<div className="bg-foreground border border-border rounded-lg p-4 flex flex-col gap-1">
			<span className="text-xs font-medium text-secondary uppercase tracking-wide">{label}</span>
			<span className="text-2xl font-semibold font-display text-primary">{value}</span>
			<span className="text-xs text-secondary">{description}</span>
		</div>
	);
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function KpiCards() {
	const [metrics, setMetrics] = useState<Metrics | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch(`${BASE_URL}/metrics`)
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then(setMetrics)
			.catch(() => setError(true));
	}, []);

	if (error) {
		return <p className="text-sm text-error">Could not load metrics.</p>;
	}

	// Skeleton placeholders while loading
	if (!metrics) {
		return (
			<div className="grid grid-cols-2 gap-3">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="bg-foreground border border-border rounded-lg p-4 h-24 animate-pulse" />
				))}
			</div>
		);
	}

	// Format helpers
	const usd = (n: number) => `$${n.toFixed(4)}`;
	const num = (n: number) => n.toLocaleString();
	const secs = (n: number) => `${(n / 1000).toFixed(2)}s`;

	const cards: KpiCardProps[] = [
		{
			label: "Presentations Generated",
			value: num(metrics.totalContentGenerated),
			description: "Total slide decks created by the LLM across all jobs.",
		},
		{
			label: "Cache Hits",
			value: num(metrics.totalCacheHits),
			description: "Jobs served from semantic cache, skipping LLM entirely.",
		},
		{
			label: "Total Cost",
			value: usd(metrics.totalCost),
			description: "Cumulative LLM spend across all generation calls.",
		},
		{
			label: "Cost Saved by Cache",
			value: usd(metrics.costSavedByCaching),
			description: "Estimated savings from cache hits at average cost per call.",
		},
		{
			label: "Avg Cost / Generation",
			value: usd(metrics.averageCost),
			description: "Average LLM spend per individual slide deck generated.",
		},
		{
			label: "Avg Generation Time",
			value: secs(metrics.averageContentGenerationTimeMs),
			description: "Mean time for the LLM to return slide content.",
		},
		{
			label: "Total Tokens Used",
			value: num(metrics.totalTokens),
			description: "Combined input and output tokens consumed by the LLM.",
		},
		{
			label: "Failed Jobs",
			value: num(metrics.totalFailures),
			description: "Jobs that could not complete due to LLM or system errors.",
		},
	];

	return (
		<>
			<div className="grid grid-cols-2 gap-3">
				{cards.map((card) => (
					<KpiCard key={card.label} {...card} />
				))}
			</div>
			<p className="text-xs text-secondary mt-2">
				* Costs are estimated based on current pricing from {"Google's"} official documentation.
			</p>
		</>
	);
}
