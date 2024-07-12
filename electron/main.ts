import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

import "./core/handlers/ipcHandlers";
import { JsonDB } from './core/util/db/json';

import electronUpdater, { type AppUpdater } from 'electron-updater';

export function getAutoUpdater(): AppUpdater {
   // Using destructuring to access autoUpdater due to the CommonJS module of 'electron-updater'.
   // It is a workaround for ESM compatibility issues, see https://github.com/electron-userland/electron-builder/issues/7976.
   const { autoUpdater } = electronUpdater;
   return autoUpdater;
}

const url = require('url');
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    width:1280,
    height:800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
    // win.loadURL(
    //   url.format({
    //     pathname: path.join(__dirname, `/dist/index.html`),
    //     protocol: "file:",
    //     slashes: true
    //   })
    // );
  }

  if(app.dock) {
    app.dock.hide();
  }
  win.setMenu(null); 
  getAutoUpdater().checkForUpdatesAndNotify();
}

app.on('window-all-closed', () => {
  win = null;
  app.quit();
})

app.whenReady().then(createWindow)
