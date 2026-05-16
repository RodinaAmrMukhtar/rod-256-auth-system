const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "db.json");

function readDb() {
  let rawData = fs.readFileSync(dbPath, "utf8");

  rawData = rawData.replace(/^\uFEFF/, "");

  if (!rawData.trim()) {
    return {
      users: [],
      ledger: []
    };
  }

  return JSON.parse(rawData);
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

module.exports = {
  readDb,
  writeDb,
  generateId
};
