import { app, BrowserWindow } from 'electron';
import path from 'node:path';

import "./core/handlers/ipcHandlers";
import { JsonDB } from './core/util/db/json';
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
    width:960,
    height:600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
}

app.on('window-all-closed', () => {
  win = null;
  JsonDB.getInstance().persistData();
  app.quit();
})

app.whenReady().then(createWindow)
