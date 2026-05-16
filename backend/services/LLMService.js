import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { buildPrompt, buildFallbackPrompt } from "../prompts/pptPrompts.js";

const PRIMARY_MODEL = "gemini-3.1-pro-preview";
const FALLBACK_MODEL = "gemini-2.5-flash";

// Delays in ms for retry attempts
const RETRY_DELAYS = [2000, 4000];

class LLMService {
	constructor() {
		this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
	}

	// Calls Gemini, parses the JSON response, and returns slide content with usage metrics
	async callModel(model, prompt) {
		const startedAt = new Date();

		const response = await this.client.models.generateContent({
			model,
			contents: prompt,
		});

		const respondedAt = new Date();

		const rawText = response.candidates[0].content.parts[0].text.trim();
		const cleaned = rawText.replace(/^```json|^```|```$/gm, "").trim();
		const slideContent = JSON.parse(cleaned);

		// Extract token usage from Gemini response metadata
		const usage = response.usageMetadata ?? {};
		const metrics = {
			modelUsed: model,
			inputTokens: usage.promptTokenCount ?? 0,
			outputTokens: usage.candidatesTokenCount ?? 0,
			totalTokens: usage.totalTokenCount ?? 0,
			startedAt,
			respondedAt,
		};

		return { slideContent, metrics };
	}

	// Retries on 503, then switches to fallback model; returns slide content + metrics
	async generateSlideContent(topic, grade, numberOfSlides) {
		const prompt = buildPrompt(topic, grade, numberOfSlides);

		for (let attempt = 0; attempt < RETRY_DELAYS.length; attempt++) {
			try {
				return await this.callModel(PRIMARY_MODEL, prompt);
			} catch (err) {
				const is503 = err?.status === 503 || err?.message?.includes("503");
				if (!is503) throw err;

				await new Promise((res) => setTimeout(res, RETRY_DELAYS[attempt]));
			}
		}

		// Primary retries exhausted — attempt fallback model with retries on 503
		const fallbackPrompt = buildFallbackPrompt(topic, grade, numberOfSlides);
		for (let attempt = 0; attempt < RETRY_DELAYS.length; attempt++) {
			try {
				return await this.callModel(FALLBACK_MODEL, fallbackPrompt);
			} catch (err) {
				const is503 = err?.status === 503 || err?.message?.includes("503");
				if (!is503) throw err;

				await new Promise((res) => setTimeout(res, RETRY_DELAYS[attempt]));
			}
		}

		// Both models exhausted — throw so the worker catches and marks job as failed
		throw new Error("Both primary and fallback models are unavailable. Please try again later.");
	}
}

export default LLMService;
