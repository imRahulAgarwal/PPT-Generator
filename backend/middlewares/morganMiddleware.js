import morgan from "morgan";
import { randomUUID } from "crypto";
import logger from "../services/LoggerService.js";

// Attaches a unique trace ID to every request for log correlation
morgan.token("traceId", (req) => req.traceId);

export const addTraceId = (req, res, next) => {
	req.traceId = randomUUID();
	next();
};

const morganFormat =
	"TraceId: :traceId | Method: :method | URL: :url | Status: :status | Time: :total-time ms | ContentLength: :res[content-length]";

const skip = (req) => req.url?.startsWith("/health");

const morganMiddleware = morgan(morganFormat, {
	stream: {
		// inside stream:
		write: (message) => {
			logger.httpInfo("HTTP_REQUEST", "Incoming HTTP request", { raw: message.trim() });
		},
	},
	skip,
});

export default morganMiddleware;
