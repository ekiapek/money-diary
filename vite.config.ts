import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";
import vuetify from "vite-plugin-vuetify";
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  define:{
    'process.env':process.env
  },
  ssr:{
    external: ["mock-aws-s3", "aws-sdk", "nock","uuid"],
    target:'node'
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      //styles: "expose",
    }),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
        vite:{
          resolve: {
            alias: {
               // Your other aliases if you have some
              "aws-sdk": resolve(__dirname, 'src/main/empty.ts'),
              "mock-aws-s3": resolve(__dirname, 'src/main/empty.ts'),
              "nock": resolve(__dirname, 'src/main/empty.ts')
            },
          }
        }
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: [
      './src/**/*.vue',
    ],
  },
  build:{
    rollupOptions:{
      external:["mock-aws-s3", "aws-sdk", "nock","uuid","crypto"]
    }
  }
})
