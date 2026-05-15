import winston from "winston";
import pool from "../configs/db.js";

// Custom Winston transport — writes log rows to PostgreSQL using the shared pool
class PostgresTransport extends winston.Transport {
	async log(info, callback) {
		try {
			await pool.query(
				`INSERT INTO logs (event, message, status, duration_ms, meta, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW() AT TIME ZONE 'UTC')`,
				[
					info.event ?? "UNKNOWN",
					info.message,
					info.status ?? info.level,
					info.durationMs ?? null,
					info.meta ? JSON.stringify(info.meta) : null,
				],
			);
		} catch (err) {
			// Avoid crashing the app if DB logging fails — log to console as fallback
			console.error("[LoggerService] DB transport error:", err.message);
		}
		callback();
	}
}

class LoggerService {
	constructor() {
		const isDev = process.env.NODE_ENV !== "production";

		// Shared format: timestamp + structured JSON
		const baseFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

		// App logger — used for all business events (job created, cache hit, ppt built etc.)
		this.app = winston.createLogger({
			level: "info",
			format: baseFormat,
			transports: [
				new winston.transports.File({ filename: "logs/app.log" }),
				new winston.transports.File({ filename: "logs/error.log", level: "error" }),
				new PostgresTransport(),
				...(isDev ? [new winston.transports.Console({ format: winston.format.simple(), level: "error" })] : []),
			],
		});

		// HTTP logger — used only by Morgan middleware
		this.http = winston.createLogger({
			level: "http",
			format: baseFormat,
			transports: [new winston.transports.File({ filename: "logs/http.log" })],
		});
	}

	// Convenience methods — each maps to a log level and passes structured fields through
	info(event, message, meta = {}, durationMs = null) {
		this.app.info(message, { event, status: "info", durationMs, meta });
	}

	success(event, message, meta = {}, durationMs = null) {
		this.app.info(message, { event, status: "success", durationMs, meta });
	}

	warn(event, message, meta = {}, durationMs = null) {
		this.app.warn(message, { event, status: "warn", durationMs, meta });
	}

	error(event, message, meta = {}, durationMs = null) {
		this.app.error(message, { event, status: "error", durationMs, meta });
	}

	httpInfo(event, message, meta = {}) {
		this.http.info(message, { event, status: "info", meta });
	}
}

// Single shared instance — import this everywhere
const logger = new LoggerService();

export default logger;
