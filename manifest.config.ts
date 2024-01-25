import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest(async (env) => {
  return {
    manifest_version: 3,
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    default_locale: 'en',
    version: '0.0.1',
    icons: {
      '16': 'src/assets/icon.png',
      '32': 'src/assets/icon.png',
      '48': 'src/assets/icon.png',
      '128': 'src/assets/icon.png',
    },
    background: {
      service_worker: 'src/background/index.ts',
      type: 'module',
    },
    action: {},
    host_permissions: [
    ],
    optional_host_permissions: [
      'https://*/*',
    ],
    permissions: [
      'storage',
      'unlimitedStorage',
      'sidePanel',
    ],
    content_scripts: [
    ],
    commands: {
      'open-app': {
        suggested_key: {
          default: 'Alt+J',
          windows: 'Alt+J',
          linux: 'Alt+J',
          mac: 'Command+J',
        },
        description: 'Open MyAwesomeApp app',
      },
    },
    side_panel: {
      default_path: 'sidepanel.html',
    },
  }
})
