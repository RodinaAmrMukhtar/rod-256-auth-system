const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function getRodExecutablePath() {
  const isWindows = process.platform === "win32";

  const localBinPath = path.join(
    __dirname,
    "..",
    "bin",
    isWindows ? "rod256_cli.exe" : "rod256_cli"
  );

  const oldLocalPath = path.join(
    __dirname,
    "..",
    "..",
    "rod256-core",
    isWindows ? "rod256_cli.exe" : "rod256_cli"
  );

  if (fs.existsSync(localBinPath)) {
    return localBinPath;
  }

  if (fs.existsSync(oldLocalPath)) {
    return oldLocalPath;
  }

  throw new Error(
    "ROD-256 CLI was not found. Run: npm run build:rod"
  );
}

function rod256Hash(message, salt) {
  const exePath = getRodExecutablePath();

  try {
    const result = execFileSync(exePath, [String(message), String(salt)], {
      encoding: "utf8"
    });

    return result.trim();
  } catch (error) {
    throw new Error("ROD-256 CLI failed: " + error.message);
  }
}

module.exports = {
  rod256Hash
};
