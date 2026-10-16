-- Suggestion box for the GUARD.IAN XPR Guide (Cloudflare D1 database "guard-ian-suggestions").
-- Builder's ruling 2026-10-16: "build the queue". Pattern: Cloudflare's official D1 docs
-- (https://developers.cloudflare.com/d1/get-started/ and /d1/tutorials/build-a-comments-api/).
-- Private: no tool reads this table back to users. Nothing about the sender is stored (no IP, no account, no client).
-- Rows are never deleted (builder's rule); the daily job sets status to 'added' or 'rejected'.

CREATE TABLE IF NOT EXISTS suggestions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	received_at TEXT NOT NULL,          -- ISO time, UTC
	fact TEXT NOT NULL,                 -- the suggested fact, cleaned (emails removed, length capped)
	source_url TEXT,                    -- optional https link the user gave
	text_hash TEXT NOT NULL UNIQUE,     -- SHA-256 of the normalised fact + link: the same suggestion is stored once
	status TEXT NOT NULL DEFAULT 'pending', -- pending | added | rejected
	checked_at TEXT,
	note TEXT                           -- the daily job's short reason; never personal details
);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status, id);

-- One row per UTC day: how many suggestions were accepted that day (the global daily cap).
CREATE TABLE IF NOT EXISTS quota (
	day TEXT PRIMARY KEY,
	n INTEGER NOT NULL
);
