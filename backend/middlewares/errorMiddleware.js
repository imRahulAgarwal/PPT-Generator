import logger from "../services/LoggerService.js";

const errorMiddleware = (err, req, res, next) => {
	const message = err.message || "Internal server error";
	const statusCode = err.statusCode || 500;

	logger.error("HTTP_ERROR", message, {
		traceId: req.traceId,
		statusCode,
		method: req.method,
		url: req.originalUrl,
		stack: err.stack,
	});

	return res.status(statusCode).json({ success: false, error: message });
};

export default errorMiddleware;
