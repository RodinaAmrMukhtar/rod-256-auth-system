const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const usePostgres = Boolean(process.env.DATABASE_URL);

let pool = null;

if (usePostgres) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

const localDbPath = path.join(__dirname, "..", "data", "db.json");

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function readLocalDb() {
  if (!fs.existsSync(localDbPath)) {
    fs.writeFileSync(
      localDbPath,
      JSON.stringify({ users: [], ledger: [] }, null, 2),
      "utf8"
    );
  }

  let rawData = fs.readFileSync(localDbPath, "utf8");
  rawData = rawData.replace(/^\uFEFF/, "");

  if (!rawData.trim()) {
    return {
      users: [],
      ledger: []
    };
  }

  return JSON.parse(rawData);
}

function writeLocalDb(data) {
  fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), "utf8");
}

async function initStorage() {
  if (!usePostgres) {
    const db = readLocalDb();

    if (!Array.isArray(db.users)) {
      db.users = [];
    }

    if (!Array.isArray(db.ledger)) {
      db.ledger = [];
    }

    writeLocalDb(db);
    console.log("Storage mode: local JSON database");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_ledger (
      id TEXT PRIMARY KEY,
      block_index INTEGER NOT NULL,
      username TEXT NOT NULL,
      event_type TEXT NOT NULL,
      status TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      previous_hash TEXT NOT NULL,
      current_hash TEXT NOT NULL
    );
  `);

  console.log("Storage mode: PostgreSQL database");
}

async function findUserByUsername(username) {
  if (!usePostgres) {
    const db = readLocalDb();
    return db.users.find((user) => user.username === username) || null;
  }

  const result = await pool.query(
    "SELECT * FROM app_users WHERE username = $1 LIMIT 1",
    [username]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapUser(result.rows[0]);
}

async function findUserByUsernameOrEmail(username, email) {
  if (!usePostgres) {
    const db = readLocalDb();

    return (
      db.users.find(
        (user) => user.username === username || user.email === email
      ) || null
    );
  }

  const result = await pool.query(
    "SELECT * FROM app_users WHERE username = $1 OR email = $2 LIMIT 1",
    [username, email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapUser(result.rows[0]);
}

async function insertUser(user) {
  if (!usePostgres) {
    const db = readLocalDb();
    db.users.push(user);
    writeLocalDb(db);
    return user;
  }

  await pool.query(
    `
      INSERT INTO app_users
      (id, username, email, password_hash, role, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      user.id,
      user.username,
      user.email,
      user.passwordHash,
      user.role,
      user.createdAt
    ]
  );

  return user;
}

async function getLedger() {
  if (!usePostgres) {
    const db = readLocalDb();
    return db.ledger;
  }

  const result = await pool.query(
    "SELECT * FROM audit_ledger ORDER BY block_index ASC"
  );

  return result.rows.map(mapLedgerBlock);
}

async function insertLedgerBlock(block) {
  if (!usePostgres) {
    const db = readLocalDb();
    db.ledger.push(block);
    writeLocalDb(db);
    return block;
  }

  await pool.query(
    `
      INSERT INTO audit_ledger
      (
        id,
        block_index,
        username,
        event_type,
        status,
        ip_address,
        timestamp,
        previous_hash,
        current_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
    [
      block.id,
      block.index,
      block.username,
      block.eventType,
      block.status,
      block.ipAddress,
      block.timestamp,
      block.previousHash,
      block.currentHash
    ]
  );

  return block;
}

async function getDebugData() {
  if (!usePostgres) {
    return readLocalDb();
  }

  return {
    users: await getAllUsersForDebug(),
    ledger: await getLedger()
  };
}

async function getAllUsersForDebug() {
  if (!usePostgres) {
    const db = readLocalDb();
    return db.users;
  }

  const result = await pool.query(
    "SELECT id, username, email, role, created_at FROM app_users ORDER BY created_at ASC"
  );

  return result.rows.map((row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  }));
}

function mapUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at
  };
}

function mapLedgerBlock(row) {
  return {
    id: row.id,
    index: row.block_index,
    username: row.username,
    eventType: row.event_type,
    status: row.status,
    ipAddress: row.ip_address,
    timestamp: row.timestamp,
    previousHash: row.previous_hash,
    currentHash: row.current_hash
  };
}

module.exports = {
  initStorage,
  generateId,
  findUserByUsername,
  findUserByUsernameOrEmail,
  insertUser,
  getLedger,
  insertLedgerBlock,
  getDebugData
};
