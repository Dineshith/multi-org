/**
 * Adds the columns and table introduced alongside the frontend API integration.
 *
 * `npm run seed` only applies `CREATE TABLE IF NOT EXISTS`, so databases that
 * already exist keep their old shape. This script issues the missing
 * `ALTER TABLE ... ADD COLUMN` statements, skipping any that are already there,
 * which makes it safe to re-run.
 *
 * Usage:
 *   npm run migrate
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const log = (...a) => console.log(...a);
const fail = (msg) => {
  console.error(`\n[migrate] FAILED: ${msg}\n`);
  process.exit(1);
};

// [table, column, definition]
const NEW_COLUMNS = [
  ["organizations", "branding", "JSON"],
  ["organizations", "stats_banner", "JSON"],
  ["organizations", "sister_organizations", "JSON"],
  ["organizations", "footer_config", "JSON"],
  ["pages", "dropdown_items", "JSON"],
  ["notices", "image_url", "VARCHAR(500)"],
  ["events", "image_url", "VARCHAR(500)"],
];

const columnExists = async (conn, table, column) => {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [table, column],
  );
  return Number(rows[0].total) > 0;
};

const tableExists = async (conn, table) => {
  const [rows] = await conn.execute(
    `SELECT COUNT(*) AS total
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?`,
    [table],
  );
  return Number(rows[0].total) > 0;
};

const run = async () => {
  const dbName = process.env.DB_NAME || "multiorg";

  log(`\n[migrate] Connecting to "${dbName}" ...`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
    });
  } catch (err) {
    fail(
      `cannot connect to "${dbName}" - ${err.code || ""} ${err.message}\n` +
        `       Run "npm run seed" first to create the database and schema.`
    );
  }

  // New tables are created by db.txt; this only backfills columns, so bail out
  // early if the core schema is missing.
  const hasUsers = await tableExists(conn, "users");
  if (!hasUsers) {
    fail(`table "users" not found in "${dbName}". Run "npm run seed" first.`);
  }

  let added = 0;
  for (const [table, column, definition] of NEW_COLUMNS) {
    if (await columnExists(conn, table, column)) continue;

    await conn.execute(
      `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`
    );
    log(`[migrate] added ${table}.${column}`);
    added += 1;
  }

  if (!added) {
    log("[migrate] schema already up to date");
  }

  await conn.end();
  log(`\n[migrate] Done. ${added} column(s) added.\n`);
};

run().catch((err) => fail(err.stack || err.message));