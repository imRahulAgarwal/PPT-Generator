import "dotenv/config";
import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import morganMiddleware, { addTraceId } from "./middlewares/morganMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

// Start the worker so it begins processing queued jobs on server start
import "./workers/pptWorker.js";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()),
	methods: ["GET", "POST"],
	allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Attach trace ID before morgan so it's available as a token
app.use(addTraceId);
app.use(morganMiddleware);

app.use("/jobs", jobRoutes);

// Must be registered after all routes — catches errors passed via next(err)
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
