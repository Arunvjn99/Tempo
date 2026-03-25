#!/usr/bin/env node
/**
 * Fetch a Stitch screen: screenshot + HTML via hosted URLs (curl) when available,
 * else via get_screen_code / get_screen_image (virtual tools).
 *
 * Configure with env (defaults = Retirement Transaction Control Hub / loan flow):
 *   STITCH_PROJECT_ID
 *   STITCH_SCREEN_ID
 *   STITCH_OUT_DIR
 *
 * Auth: STITCH_API_KEY or `npx @_davideast/stitch-mcp init`
 *
 * Usage:
 *   STITCH_API_KEY=... node scripts/fetch-stitch-screen.js
 *   npm run stitch:fetch-loan-hub
 *   npm run stitch:fetch-dashboard-smart-header
 */

import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const PROJECT_ID = process.env.STITCH_PROJECT_ID ?? "10256073304949357127";
const SCREEN_ID = process.env.STITCH_SCREEN_ID ?? "765866d442ff47e58cb7e09fcae879ba";
const OUT_DIR = process.env.STITCH_OUT_DIR ?? "designs/stitch-retirement-control-hub";

const screenName = `projects/${PROJECT_ID}/screens/${SCREEN_ID}`;
const getScreenPayload = JSON.stringify({
  name: screenName,
  projectId: PROJECT_ID,
  screenId: SCREEN_ID,
});
const codeImagePayload = JSON.stringify({ projectId: PROJECT_ID, screenId: SCREEN_ID });

function runToolJson(toolName, dataJson) {
  const r = spawnSync("npx", ["-y", "@_davideast/stitch-mcp", "tool", toolName, "-d", dataJson, "-o", "json"], {
    encoding: "utf8",
  });
  if (r.status !== 0) {
    return { ok: false, error: r.stderr || r.stdout || `exit ${r.status}` };
  }
  const raw = (r.stdout || "").trim();
  if (!raw) return { ok: false, error: "empty stdout" };
  try {
    return { ok: true, data: JSON.parse(raw) };
  } catch {
    return { ok: false, error: `invalid JSON: ${raw.slice(0, 200)}` };
  }
}

function curlToFile(url, dest) {
  const r = spawnSync("curl", ["-L", "-f", "-sS", "-o", dest, url], {
    encoding: "utf8",
  });
  if (r.status !== 0) {
    return { ok: false, error: r.stderr || `curl exit ${r.status}` };
  }
  return { ok: true };
}

/** Flatten possible MCP / API nesting for get_screen */
function extractScreenUrls(obj) {
  if (!obj || typeof obj !== "object") return {};
  const htmlUrl =
    obj.htmlCode?.downloadUrl ??
    obj.html_code?.downloadUrl ??
    obj.design?.htmlCode?.downloadUrl;
  const shotUrl =
    obj.screenshot?.downloadUrl ??
    obj.screenShot?.downloadUrl ??
    obj.design?.screenshot?.downloadUrl;
  return { htmlUrl, shotUrl };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log("Stitch fetch:", { PROJECT_ID, SCREEN_ID, OUT_DIR });

  let haveHtml = false;
  let havePng = false;

  // 1) Prefer hosted URLs + curl (matches Stitch API / user workflow)
  const gs = runToolJson("get_screen", getScreenPayload);
  let htmlUrl;
  let shotUrl;
  if (gs.ok) {
    await writeFile(join(OUT_DIR, "get-screen.raw.json"), JSON.stringify(gs.data, null, 2), "utf8");
    ({ htmlUrl, shotUrl } = extractScreenUrls(gs.data));
  } else {
    console.warn("get_screen skipped:", gs.error);
  }

  if (htmlUrl) {
    const htmlPath = join(OUT_DIR, "screen.html");
    const c = curlToFile(htmlUrl, htmlPath);
    if (c.ok) {
      console.log("Wrote (curl):", htmlPath);
      haveHtml = true;
    } else console.warn("curl HTML failed:", c.error);
  }
  if (shotUrl) {
    const pngPath = join(OUT_DIR, "screen.png");
    const c = curlToFile(shotUrl, pngPath);
    if (c.ok) {
      console.log("Wrote (curl):", pngPath);
      havePng = true;
    } else console.warn("curl screenshot failed:", c.error);
  }

  // 2) Fallback: virtual tools (download inside MCP; returns content in JSON)
  if (!haveHtml) {
    console.log("Fetching HTML via get_screen_code...");
    const code = runToolJson("get_screen_code", codeImagePayload);
    if (code.ok && code.data?.htmlContent) {
      await writeFile(join(OUT_DIR, "screen.html"), code.data.htmlContent, "utf8");
      console.log("Wrote:", join(OUT_DIR, "screen.html"));
      haveHtml = true;
    } else {
      console.warn("get_screen_code failed:", code.ok ? "no htmlContent" : code.error);
    }
  }

  if (!havePng) {
    console.log("Fetching image via get_screen_image...");
    const img = runToolJson("get_screen_image", codeImagePayload);
    if (img.ok && img.data?.imageContent) {
      const buf = Buffer.from(img.data.imageContent, "base64");
      await writeFile(join(OUT_DIR, "screen.png"), buf);
      console.log("Wrote:", join(OUT_DIR, "screen.png"));
      havePng = true;
    } else {
      console.warn("get_screen_image failed:", img.ok ? "no imageContent" : img.error);
    }
  }

  await writeFile(
    join(OUT_DIR, "README.txt"),
    [
      "Stitch screen export",
      `Project: ${PROJECT_ID}`,
      `Screen:  ${SCREEN_ID}`,
      "",
      "Files:",
      "  screen.html — generated HTML/CSS reference",
      "  screen.png  — screenshot",
      "  get-screen.raw.json — raw get_screen response (if the call succeeded)",
      "",
    ].join("\n"),
    "utf8"
  );

  if (!haveHtml || !havePng) {
    console.error("Missing assets. Set STITCH_API_KEY or run: npx @_davideast/stitch-mcp init");
    process.exit(1);
  }
  console.log("Done.");
}

main();
