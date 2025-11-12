import { db } from "./db.js";

const schema = `
DROP TABLE IF EXISTS verification_token CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE verification_token (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);
`;

async function setupDatabase() {
  try {
    await db.query(schema);
    console.log("✅ Database schema created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating schema:", error);
    process.exit(1);
  }
}

setupDatabase();