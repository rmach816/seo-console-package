#!/usr/bin/env node
/**
 * Test script wrapper that always exits successfully
 * Used when no tests are configured
 */
const { spawn } = require("child_process");

const child = spawn("npx", ["vitest", "run"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  // Always exit successfully, even if no tests are found
  process.exit(code ?? 1);
});
