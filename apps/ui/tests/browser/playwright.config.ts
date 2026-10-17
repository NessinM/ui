import { resolve } from "node:path";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "**/*.browser.ts",
  fullyParallel: false,
  workers: 1,
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  use: {
    baseURL: "http://127.0.0.1:4020",
    viewport: { width: 1000, height: 800 },
    reducedMotion: "reduce",
    actionTimeout: 5000,
  },
  webServer: {
    command:
      "COSS_BROWSER_TESTS=1 bunx next dev --webpack --hostname 127.0.0.1 --port 4020",
    cwd: resolve(__dirname, "../.."),
    url: "http://127.0.0.1:4020/ui/test-fixtures/message-scroller",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
