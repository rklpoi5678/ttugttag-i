-- schema.sql
CREATE TABLE IF NOT EXISTS UserProjects (
    id TEXT PRIMARY KEY,
    clerkUserId TEXT NOT NULL,
    projectName TEXT NOT NULL,
    projectDescription TEXT,
    tldrawContent TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    screenSize TEXT,
    projectType TEXT,
    tags TEXT
);

CREATE INDEX IF NOT EXISTS idx_clerkUserId ON UserProjects (clerkUserId);