import pool from "../configs/db.js";

const SIMILARITY_THRESHOLD = 0.92;

// Returns cached slide JSON if a similar request exists, otherwise null
const checkSemanticCache = async (embeddingVector) => {
	// pgvector cosine similarity: 1 - cosine_distance gives similarity score
	const query = `
    SELECT slide_content
    FROM ppt_cache
    WHERE 1 - (embedding <=> $1::vector) >= $2
    ORDER BY embedding <=> $1::vector
    LIMIT 1;
  `;

	const vectorString = `[${embeddingVector.join(",")}]`;
	const result = await pool.query(query, [vectorString, SIMILARITY_THRESHOLD]);

	if (result.rows.length === 0) return null;

	return result.rows[0].slide_content;
};

export default checkSemanticCache;
