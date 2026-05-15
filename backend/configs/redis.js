import "dotenv/config";
import Redis from "ioredis";

// Shared Redis connection used by BullMQ worker and queue
const redisConnection = new Redis({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
	maxRetriesPerRequest: null, // Required by BullMQ
});

export default redisConnection;
