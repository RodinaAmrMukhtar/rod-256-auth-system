const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

function loadKeyFromEnvOrFile(envName, fileName) {
  if (process.env[envName]) {
    return process.env[envName].replace(/\\n/g, "\n");
  }

  const keyPath = path.join(__dirname, "..", "keys", fileName);

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `${envName} is missing and keys/${fileName} was not found`
    );
  }

  return fs.readFileSync(keyPath, "utf8");
}

const privateKey = loadKeyFromEnvOrFile("RSA_PRIVATE_KEY", "private.pem");
const publicKey = loadKeyFromEnvOrFile("RSA_PUBLIC_KEY", "public.pem");

function signAuthToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: "1h"
    }
  );
}

function verifyAuthToken(token) {
  return jwt.verify(token, publicKey, {
    algorithms: ["RS256"]
  });
}

module.exports = {
  signAuthToken,
  verifyAuthToken
};
