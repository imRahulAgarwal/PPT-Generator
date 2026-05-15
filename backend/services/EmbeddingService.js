import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

class EmbeddingService {
	constructor() {
		this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
	}

	// Returns a 768-dim float array for the given text
	async getEmbedding(text) {
		const response = await this.client.models.embedContent({
			model: EMBEDDING_MODEL,
			contents: text,
			config: { outputDimensionality: EMBEDDING_DIMENSIONS },
		});

		return response.embeddings[0].values;
	}
}

export default EmbeddingService;
