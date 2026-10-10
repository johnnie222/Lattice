// Version + build id baked into the bundle, shown in Settings → About.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

export function appVersionDefines() {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  let build = process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || "";
  if (!build) {
    try {
      build = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    } catch {
      build = "dev";
    }
  }
  return {
    __APP_VERSION__: JSON.stringify(pkg.version ?? "0.0.0"),
    __APP_BUILD__: JSON.stringify(build.slice(0, 7)),
  };
}
