import rateLimit from "express-rate-limit";

// Applies to POST /jobs — limits burst PPT generation requests per IP
export const createJobLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minute window
	max: 10, // max 10 requests per IP per window
	standardHeaders: true, // return RateLimit-* headers in response
	legacyHeaders: false,
	message: { success: false, error: "Too many requests. Please try again after 10 minutes." },
});
