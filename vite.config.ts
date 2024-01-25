import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './manifest.config'
import { viteZip } from 'vite-plugin-zip-file';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), crx({ manifest }),
    viteZip({
      folderPath: path.resolve('./dist'),
      outPath: path.resolve('./zips'),
      // outPath: path.resolve(__dirname),
      zipName: 'chromium.zip',
      // enabled: env.NODE_ENV === 'production'? true: false
    })
  ],
  esbuild: {
    // drop: ['console', 'debugger'],
    minifyIdentifiers: false,
  //   keepNames: true,
  },
  build: {
    minify: false,
    rollupOptions: {
      input: [path.resolve('./app.html'), path.resolve('./sidepanel.html')],
    },
  },
})
