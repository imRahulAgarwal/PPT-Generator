import { z } from "zod";

const createJobSchema = z.object({
	topic: z.string().min(3, "Topic must be at least 3 characters").max(200, "Topic must be under 200 characters"),
	grade: z.string().min(1, "Grade is required").max(20, "Grade must be under 20 characters"),
	numberOfSlides: z.number().int().min(1, "Minimum 1 slide").max(20, "Maximum 20 slides"),
});

export default createJobSchema;
