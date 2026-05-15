-- Enable pgvector extension (run once per DB)
CREATE EXTENSION IF NOT EXISTS vector;

-- Stores each PPT generation request and its current status
CREATE TABLE IF NOT EXISTS jobs (
  id                                  UUID PRIMARY KEY,
  topic                               TEXT NOT NULL,
  grade                               TEXT NOT NULL,
  number_of_slides                    INTEGER NOT NULL,
  status                              TEXT NOT NULL DEFAULT 'pending',
  s3_key                              TEXT,
  error_message                       TEXT,
  served_from_cache                   BOOLEAN DEFAULT FALSE,
  completed_at                        TIMESTAMPTZ,
  is_file_deleted_from_cloud_storage  BOOLEAN DEFAULT FALSE,
  deleted_at                          TIMESTAMPTZ,
  created_at                          TIMESTAMPTZ NOT NULL,
  updated_at                          TIMESTAMPTZ NOT NULL
);

-- Stores embeddings and their generated slide JSON for semantic cache lookups
CREATE TABLE IF NOT EXISTS ppt_cache (
  id            SERIAL PRIMARY KEY,
  embedding     vector(768) NOT NULL,
  slide_content TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL
);

-- Index for fast cosine similarity search on the embedding column
CREATE INDEX IF NOT EXISTS ppt_cache_embedding_idx
  ON ppt_cache USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Stores AI model usage metrics per LLM call, linked to a job
CREATE TABLE IF NOT EXISTS ai_metrics (
  id              SERIAL PRIMARY KEY,
  job_id          UUID NOT NULL REFERENCES jobs(id),
  model_used      TEXT NOT NULL,
  input_tokens    INTEGER NOT NULL,
  output_tokens   INTEGER NOT NULL,
  total_tokens    INTEGER NOT NULL,
  approx_cost     NUMERIC(10, 6) NOT NULL,  -- in USD
  started_at      TIMESTAMPTZ NOT NULL,
  responded_at    TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL
);

-- Stores application logs written by Winston DB transport
CREATE TABLE IF NOT EXISTS logs (
  id          SERIAL PRIMARY KEY,
  event       TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL,       -- success | error | info | warn
  duration_ms NUMERIC(10, 3),      -- nullable; not all events have a duration
  meta        JSONB,               -- flexible field: jobId, error, extra context
  created_at  TIMESTAMPTZ NOT NULL
);