import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pool from "../configs/db.js";
import logger from "../services/LoggerService.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Reads and executes schema.sql — safe to run on every startup (all statements are idempotent)
const initDb = async () => {
	const sql = readFileSync(join(__dirname, "../migrations/schema.sql"), "utf8");
	await pool.query(sql);
	logger.info("DB_INIT", "Database schema initialized successfully");
};

export default initDb;
