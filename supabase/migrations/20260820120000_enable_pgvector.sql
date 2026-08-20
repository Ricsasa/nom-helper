-- pgvector is instance-wide. The rag schema consumes it; this migration only enables it.
CREATE EXTENSION IF NOT EXISTS vector;
