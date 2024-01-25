// vite.config.ts
import path from "path";
import { defineConfig } from "file:///Users/ishandutta2007/Documents/Projects/SGLT/multitranslate/node_modules/vite/dist/node/index.js";
import react from "file:///Users/ishandutta2007/Documents/Projects/SGLT/multitranslate/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///Users/ishandutta2007/Documents/Projects/SGLT/multitranslate/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import tsconfigPaths from "file:///Users/ishandutta2007/Documents/Projects/SGLT/multitranslate/node_modules/vite-tsconfig-paths/dist/index.mjs";

// manifest.config.ts
import { defineManifest } from "file:///Users/ishandutta2007/Documents/Projects/SGLT/multitranslate/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var manifest_config_default = defineManifest(async (env) => {
  return {
    manifest_version: 3,
    name: "__MSG_appName__",
    description: "__MSG_appDesc__",
    default_locale: "en",
    version: "0.0.17",
    icons: {
      "16": "src/assets/icon.png",
      "32": "src/assets/icon.png",
      "48": "src/assets/icon.png",
      "128": "src/assets/icon.png"
    },
    background: {
      service_worker: "src/background/index.ts",
      type: "module"
    },
    action: {},
    host_permissions: [
      "https://*.bing.com/",
      "https://*.openai.com/",
      "https://bard.google.com/",
      "https://*.claude.ai/",
      "https://*.pi.ai/",
      "https://*.phind.com/",
      "https://*.you.com/",
      "https://*.cohere.com/",
      "https://*.cohere.ai/",
      "wss://*/*"
    ],
    optional_host_permissions: [
      "https://*/*"
    ],
    permissions: [
      "storage",
      "unlimitedStorage",
      "sidePanel",
      "declarativeNetRequestWithHostAccess",
      "cookies",
      "tabs",
      "scripting"
    ],
    content_scripts: [
      {
        matches: ["https://chat.openai.com/*"],
        js: ["src/content-script/chatgpt-inpage-proxy.ts"]
      },
      {
        matches: ["https://you.com/*"],
        js: ["src/content-script/you-inpage-proxy.ts"]
      }
    ],
    commands: {
      "open-app": {
        suggested_key: {
          default: "Alt+J",
          windows: "Alt+J",
          linux: "Alt+J",
          mac: "Command+J"
        },
        description: "Open MyAwesomeApp app"
      }
    },
    side_panel: {
      default_path: "sidepanel.html"
    },
    declarative_net_request: {
      rule_resources: [
        {
          id: "ruleset_bing",
          enabled: true,
          path: "src/rules/bing.json"
        }
      ]
    }
  };
});

// vite.config.ts
import { viteZip } from "file:///Users/ishandutta2007/Documents/Projects/SGLT/multitranslate/node_modules/vite-plugin-zip-file/lib/index.cjs";
var vite_config_default = defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    crx({ manifest: manifest_config_default }),
    viteZip({
      folderPath: path.resolve("./dist"),
      outPath: path.resolve("./zips"),
      // outPath: path.resolve(__dirname),
      zipName: "chromium.zip"
      // enabled: env.NODE_ENV === 'production'? true: false
    })
  ],
  esbuild: {
    drop: ["console", "debugger"],
    minifyIdentifiers: false
    //   keepNames: true,
  },
  build: {
    // minify: false,
    rollupOptions: {
      input: ["app.html", "sidepanel.html"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2lzaGFuZHV0dGEyMDA3L0RvY3VtZW50cy9Qcm9qZWN0cy9TR0xUL0dyYW5kR1BUXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaXNoYW5kdXR0YTIwMDcvRG9jdW1lbnRzL1Byb2plY3RzL1NHTFQvR3JhbmRHUFQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2lzaGFuZHV0dGEyMDA3L0RvY3VtZW50cy9Qcm9qZWN0cy9TR0xUL0dyYW5kR1BUL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuY29uZmlnJ1xuaW1wb3J0IHsgdml0ZVppcCB9IGZyb20gJ3ZpdGUtcGx1Z2luLXppcC1maWxlJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt0c2NvbmZpZ1BhdGhzKCksIHJlYWN0KCksIGNyeCh7IG1hbmlmZXN0IH0pLFxuICAgIHZpdGVaaXAoe1xuICAgICAgZm9sZGVyUGF0aDogcGF0aC5yZXNvbHZlKCcuL2Rpc3QnKSxcbiAgICAgIG91dFBhdGg6IHBhdGgucmVzb2x2ZSgnLi96aXBzJyksXG4gICAgICAvLyBvdXRQYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lKSxcbiAgICAgIHppcE5hbWU6ICdjaHJvbWl1bS56aXAnLFxuICAgICAgLy8gZW5hYmxlZDogZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbic/IHRydWU6IGZhbHNlXG4gICAgfSlcbiAgXSxcbiAgZXNidWlsZDoge1xuICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICAgIG1pbmlmeUlkZW50aWZpZXJzOiBmYWxzZSxcbiAgLy8gICBrZWVwTmFtZXM6IHRydWUsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gbWluaWZ5OiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDogWydhcHAuaHRtbCcsICdzaWRlcGFuZWwuaHRtbCddLFxuICAgIH0sXG4gIH0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaXNoYW5kdXR0YTIwMDcvRG9jdW1lbnRzL1Byb2plY3RzL1NHTFQvR3JhbmRHUFRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9pc2hhbmR1dHRhMjAwNy9Eb2N1bWVudHMvUHJvamVjdHMvU0dMVC9HcmFuZEdQVC9tYW5pZmVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2lzaGFuZHV0dGEyMDA3L0RvY3VtZW50cy9Qcm9qZWN0cy9TR0xUL0dyYW5kR1BUL21hbmlmZXN0LmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZU1hbmlmZXN0IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVNYW5pZmVzdChhc3luYyAoZW52KSA9PiB7XG4gIHJldHVybiB7XG4gICAgbWFuaWZlc3RfdmVyc2lvbjogMyxcbiAgICBuYW1lOiAnX19NU0dfYXBwTmFtZV9fJyxcbiAgICBkZXNjcmlwdGlvbjogJ19fTVNHX2FwcERlc2NfXycsXG4gICAgZGVmYXVsdF9sb2NhbGU6ICdlbicsXG4gICAgdmVyc2lvbjogJzAuMC4xNycsXG4gICAgaWNvbnM6IHtcbiAgICAgICcxNic6ICdzcmMvYXNzZXRzL2ljb24ucG5nJyxcbiAgICAgICczMic6ICdzcmMvYXNzZXRzL2ljb24ucG5nJyxcbiAgICAgICc0OCc6ICdzcmMvYXNzZXRzL2ljb24ucG5nJyxcbiAgICAgICcxMjgnOiAnc3JjL2Fzc2V0cy9pY29uLnBuZycsXG4gICAgfSxcbiAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICBzZXJ2aWNlX3dvcmtlcjogJ3NyYy9iYWNrZ3JvdW5kL2luZGV4LnRzJyxcbiAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgIH0sXG4gICAgYWN0aW9uOiB7fSxcbiAgICBob3N0X3Blcm1pc3Npb25zOiBbXG4gICAgICAnaHR0cHM6Ly8qLmJpbmcuY29tLycsXG4gICAgICAnaHR0cHM6Ly8qLm9wZW5haS5jb20vJyxcbiAgICAgICdodHRwczovL2JhcmQuZ29vZ2xlLmNvbS8nLFxuICAgICAgJ2h0dHBzOi8vKi5jbGF1ZGUuYWkvJyxcbiAgICAgICdodHRwczovLyoucGkuYWkvJyxcbiAgICAgICdodHRwczovLyoucGhpbmQuY29tLycsXG4gICAgICAnaHR0cHM6Ly8qLnlvdS5jb20vJyxcbiAgICAgICdodHRwczovLyouY29oZXJlLmNvbS8nLFxuICAgICAgJ2h0dHBzOi8vKi5jb2hlcmUuYWkvJyxcbiAgICAgICd3c3M6Ly8qLyonLFxuICAgIF0sXG4gICAgb3B0aW9uYWxfaG9zdF9wZXJtaXNzaW9uczogW1xuICAgICAgJ2h0dHBzOi8vKi8qJyxcbiAgICBdLFxuICAgIHBlcm1pc3Npb25zOiBbXG4gICAgICAnc3RvcmFnZScsXG4gICAgICAndW5saW1pdGVkU3RvcmFnZScsXG4gICAgICAnc2lkZVBhbmVsJyxcbiAgICAgICdkZWNsYXJhdGl2ZU5ldFJlcXVlc3RXaXRoSG9zdEFjY2VzcycsXG4gICAgICBcImNvb2tpZXNcIixcbiAgICAgIFwidGFic1wiLFxuICAgICAgXCJzY3JpcHRpbmdcIixcbiAgICBdLFxuICAgIGNvbnRlbnRfc2NyaXB0czogW1xuICAgICAge1xuICAgICAgICBtYXRjaGVzOiBbJ2h0dHBzOi8vY2hhdC5vcGVuYWkuY29tLyonXSxcbiAgICAgICAganM6IFsnc3JjL2NvbnRlbnQtc2NyaXB0L2NoYXRncHQtaW5wYWdlLXByb3h5LnRzJ10sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBtYXRjaGVzOiBbJ2h0dHBzOi8veW91LmNvbS8qJ10sXG4gICAgICAgIGpzOiBbJ3NyYy9jb250ZW50LXNjcmlwdC95b3UtaW5wYWdlLXByb3h5LnRzJ10sXG4gICAgICB9LFxuICAgIF0sXG4gICAgY29tbWFuZHM6IHtcbiAgICAgICdvcGVuLWFwcCc6IHtcbiAgICAgICAgc3VnZ2VzdGVkX2tleToge1xuICAgICAgICAgIGRlZmF1bHQ6ICdBbHQrSicsXG4gICAgICAgICAgd2luZG93czogJ0FsdCtKJyxcbiAgICAgICAgICBsaW51eDogJ0FsdCtKJyxcbiAgICAgICAgICBtYWM6ICdDb21tYW5kK0onLFxuICAgICAgICB9LFxuICAgICAgICBkZXNjcmlwdGlvbjogJ09wZW4gTXVsdGlHUFQgYXBwJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzaWRlX3BhbmVsOiB7XG4gICAgICBkZWZhdWx0X3BhdGg6ICdzaWRlcGFuZWwuaHRtbCcsXG4gICAgfSxcbiAgICBkZWNsYXJhdGl2ZV9uZXRfcmVxdWVzdDoge1xuICAgICAgcnVsZV9yZXNvdXJjZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAncnVsZXNldF9iaW5nJyxcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHBhdGg6ICdzcmMvcnVsZXMvYmluZy5qc29uJ1xuICAgICAgICB9XG4gICAg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
