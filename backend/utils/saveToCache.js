import pool from "../configs/db.js";

// Stores the embedding and slide JSON so future similar requests can be served from cache
const saveToCache = async (embeddingVector, slideContent) => {
	const vectorString = `[${embeddingVector.join(",")}]`;

	const query = `
    INSERT INTO ppt_cache (embedding, slide_content, created_at)
    VALUES ($1::vector, $2, NOW() AT TIME ZONE 'UTC');
  `;

	await pool.query(query, [vectorString, JSON.stringify(slideContent)]);
};

export default saveToCache;
