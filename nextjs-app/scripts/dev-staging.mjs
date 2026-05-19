/**
 * Next.js only auto-loads .env, .env.local, .env.development*, .env.production*, etc.
 * It does not load .env.staging. This script loads .env.staging into the environment,
 * then runs the same dev flow as `npm run dev` (typegen + next --turbo).
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.staging");

const loaded = dotenv.config({ path: envPath, override: true });
if (loaded.error) {
  console.error(`[dev-staging] Could not read ${envPath}:`, loaded.error.message);
  process.exit(1);
}

const shell = process.platform === "win32";

function run(label, command, args) {
  const r = spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
    shell,
  });
  if (r.status !== 0) {
    console.error(`[dev-staging] "${label}" exited with code ${r.status ?? "unknown"}`);
    process.exit(r.status ?? 1);
  }
}

run("typegen", "npm", ["run", "typegen"]);
run("next dev", "npx", ["next", "--turbo"]);
