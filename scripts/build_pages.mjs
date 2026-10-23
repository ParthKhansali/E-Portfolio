import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const apiDir = path.resolve("src/app/api");
const backupDir = path.resolve(".api_backup_pages");

let apiMoved = false;

try {
  console.log("Preparing Next.js Static Export for GitHub Pages...");

  // Temporarily stage API routes so Next.js static export succeeds without server runtime errors
  if (fs.existsSync(apiDir)) {
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true, force: true });
    }
    fs.cpSync(apiDir, backupDir, { recursive: true });
    fs.rmSync(apiDir, { recursive: true, force: true });
    apiMoved = true;
    console.log("Backed up API routes for static export.");
  }

  // Run next build with STATIC_EXPORT=true
  console.log("Running Next.js static build...");
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "true",
      BASE_PATH: "/E-Portfolio",
      NEXT_PUBLIC_BASE_PATH: "/E-Portfolio",
    },
  });

  console.log("Static export successfully created in ./out !");
} catch (err) {
  console.error("Static export build error:", err);
  process.exitCode = 1;
} finally {
  // Always restore API routes back to src/app/api
  if (apiMoved && fs.existsSync(backupDir)) {
    fs.cpSync(backupDir, apiDir, { recursive: true });
    fs.rmSync(backupDir, { recursive: true, force: true });
    console.log("Restored API routes to src/app/api.");
  }
}
