// Usage: npm run seed
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = path.resolve(__dirname, "..", "..");

// CLI arguments
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const hasFlag = (name) => args.includes(`--${name}`);

const EMAIL = flag("email", "super@admin.com").trim();
const PASSWORD = flag("password", "password123");
const NAME = flag("name", "Super Admin");
const WITH_DEMO = hasFlag("demo");

const DB_NAME = process.env.DB_NAME || "multiorg";

const log = (...a) => console.log(...a);
const fail = (msg) => {
  console.error(`\n[seed] FAILED: ${msg}\n`);
  process.exit(1);
};

// schema from db.txt
const loadSchemaStatements = () => {
  const schemaFile = path.join(BACKEND_DIR, "db.txt");
  if (!fs.existsSync(schemaFile)) fail(`db.txt not found at ${schemaFile}`);

  return fs
    .readFileSync(schemaFile, "utf8")
    // strip line comments: -- ... and # ...
    .split("\n")
    .map((line) => line.replace(/^\s*(--|#).*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
};

// seeding steps
const run = async () => {
  log(`\n[seed] Connecting to MySQL as "${process.env.DB_USER}" ...`);

  let admin;
  try {
    admin = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  } catch (err) {
    if (err.code === "ER_ACCESS_DENIED_ERROR" || err.code === "ER_ACCESS_DENIED_NO_PASSWORD_ERROR") {
      fail(
        `MySQL rejected the credentials for "${process.env.DB_USER}".\n` +
          `       Root often uses socket auth on Ubuntu/Debian. Fix it once with:\n\n` +
          `         sudo mysql -e "ALTER USER '${process.env.DB_USER}'@'localhost' \\\n` +
          `           IDENTIFIED VIA mysql_native_password USING PASSWORD('${process.env.DB_PASSWORD}'); FLUSH PRIVILEGES;"\n`
      );
    }
    fail(`cannot connect to MySQL - ${err.code || ""} ${err.message}`);
  }

  const [[ver]] = await admin.query("SELECT VERSION() AS v");
  log(`[seed] Connected (MySQL ${ver.v})`);

  // 1. database
  await admin.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  log(`[seed] Database "${DB_NAME}" ready`);

  await admin.query(`USE \`${DB_NAME}\``);
  const db = admin;

  // 2. schema
  const statements = loadSchemaStatements();
  for (const stmt of statements) {
    if (/^USE\s/i.test(stmt)) continue; // we already selected the database
    await admin.query(stmt);
  }
  log(`[seed] Schema applied (${statements.length} statements)`);

  // 3. super admin (idempotent upsert)
  const hash = await bcrypt.hash(PASSWORD, 10);
  await db.query(
    `INSERT INTO users (organization_id, name, email, password_hash, role, token_version)
     VALUES (NULL, ?, ?, ?, 'SUPER_ADMIN', 0)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role = 'SUPER_ADMIN',
       organization_id = NULL`,
    [NAME, EMAIL, hash]
  );
  log(`[seed] SUPER_ADMIN ready -> ${EMAIL}`);

  // 4. optional demo organization + org admin
  if (WITH_DEMO) {
    const orgName = flag("org", "Kathmandu Model College");
    const orgEmail = flag("orgEmail", "info@ktmcollege.edu.np");
    const orgAdminEmail = flag("orgAdminEmail", "orgadmin@college.edu.np");

    const slug = orgName.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

    await db.query(
      `INSERT INTO organizations (name, type, slug, email, status)
       VALUES (?, 'COLLEGE', ?, ?, 'ACTIVE')
       ON DUPLICATE KEY UPDATE name = VALUES(name), status = 'ACTIVE'`,
      [orgName, slug, orgEmail]
    );

    const [[org]] = await db.query(`SELECT id FROM organizations WHERE slug = ? LIMIT 1`, [slug]);

    await db.query(
      `INSERT INTO users (organization_id, name, email, password_hash, role, token_version)
       VALUES (?, ?, ?, ?, 'ORG_ADMIN', 0)
       ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         role = 'ORG_ADMIN',
         organization_id = VALUES(organization_id)`,
      [org.id, "Org Admin", orgAdminEmail, hash]
    );
    log(`[seed] Demo org "${orgName}" (id=${org.id}, slug=${slug})`);
    log(`[seed] ORG_ADMIN ready   -> ${orgAdminEmail}`);
  }

  await admin.end();

  log(`\n[seed] ---------------------------------------------`);
  log(`[seed] Done. Sign in with:`);
  log(`[seed]   email    : ${EMAIL}`);
  log(`[seed]   password : ${PASSWORD}`);
  if (WITH_DEMO) log(`[seed]   org admin: ${flag("orgAdminEmail", "orgadmin@college.edu.np")} / ${PASSWORD}`);
  log(`[seed] ---------------------------------------------\n`);
  log(`[seed] Try it:`);
  log(`[seed]   curl -X POST http://localhost:6000/api/auth/login \\`);
  log(`[seed]     -H 'Content-Type: application/json' \\`);
  log(`[seed]     -d '{"email":"${EMAIL}","password":"${PASSWORD}"}'\n`);
};

run().catch((err) => fail(err.stack || err.message));
