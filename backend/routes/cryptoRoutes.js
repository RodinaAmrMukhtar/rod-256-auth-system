const express = require("express");
const crypto = require("crypto");
const { rod256Hash } = require("../utils/rod256Runner");

const router = express.Router();

function standardHash(algorithm, message) {
  try {
    return crypto.createHash(algorithm).update(message).digest("hex");
  } catch (error) {
    return "Not supported in this Node/OpenSSL version";
  }
}

router.post("/compare", (req, res) => {
  const { message, salt } = req.body;

  if (!message || !salt) {
    return res.status(400).json({
      error: "message and salt are required"
    });
  }

  const combinedInput = `${message}${salt}`;

  const results = {
    customAlgorithm: {
      name: "ROD-256",
      type: "Custom 256-bit hashing algorithm",
      hash: rod256Hash(message, salt)
    },
    shaFamily: {
      sha1: standardHash("sha1", combinedInput),
      sha224: standardHash("sha224", combinedInput),
      sha256: standardHash("sha256", combinedInput),
      sha384: standardHash("sha384", combinedInput),
      sha512: standardHash("sha512", combinedInput),
      sha3_256: standardHash("sha3-256", combinedInput),
      sha3_512: standardHash("sha3-512", combinedInput)
    },
    ripemdFamily: {
      ripemd160: standardHash("ripemd160", combinedInput)
    }
  };

  res.json({
    message,
    salt,
    combinedInput,
    results
  });
});

module.exports = router;
