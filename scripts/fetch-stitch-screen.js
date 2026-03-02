#!/usr/bin/env node
/**
 * Fetch Stitch screen "Retirement Transaction Control Hub" (image + code).
 * Used so the Start Loan flow can match the Stitch design.
 *
 * Prereqs: Set STITCH_API_KEY or run `npx @_davideast/stitch-mcp init`.
 *
 * Usage:
 *   STITCH_API_KEY=your-key node scripts/fetch-stitch-screen.js
 *   npm run stitch:fetch-loan-hub
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const PROJECT_ID = "10256073304949357127";
const SCREEN_ID = "765866d442ff47e58cb7e09fcae879ba";
const OUT_DIR = "designs/stitch-retirement-control-hub";

const payload = JSON.stringify({ projectId: PROJECT_ID, screenId: SCREEN_ID });

function runTool(toolName) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      ["-y", "@_davideast/stitch-mcp", "tool", toolName, "-d", payload],
      { stdio: ["ignore", "pipe", "pipe"], shell: true }
    );
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (d) => { stdout += d; });
    child.stderr?.on("data", (d) => { stderr += d; });
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(`exit ${code}: ${stderr || stdout}`));
      else resolve({ stdout, stderr });
    });
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log("Fetching Stitch screen code...");
  // Note: If you see "is not valid JSON", the stitch-mcp CLI may expect -d differently.
  // Use the manual commands in docs/STITCH_LOAN_FLOW.md instead.
  try {
    const { stdout: codeOut } = await runTool("get_screen_code");
    const code = codeOut.trim();
    if (code) {
      const htmlPath = join(OUT_DIR, "screen.html");
      await writeFile(htmlPath, code, "utf8");
      console.log("Wrote:", htmlPath);
    } else {
      console.warn("get_screen_code returned no content (check STITCH_API_KEY or run stitch-mcp init).");
    }
  } catch (e) {
    console.warn("get_screen_code failed:", e.message);
  }

  console.log("Fetching Stitch screen image...");
  try {
    const { stdout: imgOut } = await runTool("get_screen_image");
    const imgPath = join(OUT_DIR, "screen-image.json");
    await writeFile(imgPath, imgOut.trim() || "{}", "utf8");
    console.log("Wrote:", imgPath);
    const parsed = JSON.parse(imgOut || "{}");
    if (parsed?.base64) {
      const buf = Buffer.from(parsed.base64, "base64");
      await writeFile(join(OUT_DIR, "screen.png"), buf);
      console.log("Wrote: designs/stitch-retirement-control-hub/screen.png");
    }
  } catch (e) {
    console.warn("get_screen_image failed:", e.message);
  }

  console.log("Done. See docs/STITCH_LOAN_FLOW.md for how to use these assets.");
}

main();
