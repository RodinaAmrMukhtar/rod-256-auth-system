require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { rod256Hash } = require("./utils/rod256Runner");
const { initStorage, getDebugData } = require("./utils/storage");

const authRoutes = require("./routes/authRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ROD-256 Secure Authentication Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    project: "Cloud-Based Secure Authentication System",
    algorithm: "ROD-256",
    ledger: "Blockchain-style audit ledger",
    tokenSigning: "RSA RS256",
    storage: process.env.DATABASE_URL ? "PostgreSQL" : "Local JSON"
  });
});

app.get("/api/debug/db", async (req, res) => {
  try {
    const data = await getDebugData();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Could not load debug data",
      error: error.message
    });
  }
});

app.post("/api/rod256/hash", (req, res) => {
  const { message, salt } = req.body;

  if (!message || !salt) {
    return res.status(400).json({
      error: "message and salt are required"
    });
  }

  const hash = rod256Hash(message, salt);

  res.json({
    algorithm: "ROD-256",
    message,
    salt,
    hash,
    length: hash.length
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/crypto", cryptoRoutes);

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await initStorage();

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend failed to start:", error.message);
    process.exit(1);
  }
}

startServer();
