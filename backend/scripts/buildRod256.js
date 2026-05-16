const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..", "..");
const coreDir = path.join(projectRoot, "rod256-core");
const outputDir = path.join(__dirname, "..", "bin");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const isWindows = process.platform === "win32";
const outputFile = isWindows ? "rod256_cli.exe" : "rod256_cli";
const outputPath = path.join(outputDir, outputFile);

const sourceFiles = [
  path.join(coreDir, "rod256_cli.cpp"),
  path.join(coreDir, "rod256.cpp")
];

console.log("Building ROD-256 C++ CLI...");
console.log("Output:", outputPath);

execFileSync("g++", [...sourceFiles, "-o", outputPath], {
  stdio: "inherit"
});

console.log("ROD-256 CLI build completed.");
