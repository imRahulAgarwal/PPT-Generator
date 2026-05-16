# APPROACH.md

## 1. Understanding the Problem, Thinking of Solution, Researching and Validating (4 hours)

Read the assignment carefully to understand the core problem — PPT generation was slow, expensive, and breaking under load. Spent time thinking about where the biggest problems were before writing any code.

Once the approach was clear, validated the ideas with LLMs and cross-checked with official documentation.

**References:**

- [pgvector — Vector Similarity Search for PostgreSQL](https://github.com/pgvector/pgvector)
- [Google Gemini Embedding Model](https://ai.google.dev/gemini-api/docs/embeddings)
- [Google Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [AWS S3 Pricing](https://aws.amazon.com/s3/pricing/)

---

## 2. Implementation of Actual Structure (7 hours)

Built the full system end to end — backend API, worker process, cron job, frontend UI, and database schema.

---

## 3. Optimization, Testing and Deployment (4 hours)

Tested the full flow end to end, verified cache hits were working correctly, and deployed the system.
