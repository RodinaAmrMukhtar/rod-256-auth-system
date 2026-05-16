const { generateKeyPairSync } = require("crypto");
const fs = require("fs");
const path = require("path");

const keysDir = path.join(__dirname, "..", "keys");

if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem"
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem"
  }
});

fs.writeFileSync(path.join(keysDir, "private.pem"), privateKey);
fs.writeFileSync(path.join(keysDir, "public.pem"), publicKey);

console.log("RSA key pair generated successfully.");
console.log("Private key: keys/private.pem");
console.log("Public key : keys/public.pem");
