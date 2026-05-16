const express = require("express");
const { getLedger, verifyLedger } = require("../services/ledgerService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json({
      ledger: await getLedger()
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load ledger",
      error: error.message
    });
  }
});

router.get("/verify", async (req, res) => {
  try {
    res.json(await verifyLedger());
  } catch (error) {
    res.status(500).json({
      valid: false,
      message: "Could not verify ledger",
      error: error.message
    });
  }
});

module.exports = router;
