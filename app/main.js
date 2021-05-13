const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');
const open = require('open');
const fs = require('fs');

const download = require('./src/download');

const envConfig = require('./envConfig');
const nodeEnv = process.env.NODE_ENV;
const indexPageURL = nodeEnv
  ? envConfig[nodeEnv].staticPath
  : envConfig.staticLocalPath;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    minWidth: 1280,
    height: 800,
    minHeight: 800,
    x: 0,
    y: 0,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  win.loadURL(indexPageURL);
  win.once('ready-to-show', () => {
    win.show();
    download();
    if (nodeEnv === 'locale') {
      win.webContents.openDevTools();
    }
  });

  win.on('closed', () => {
    win = null;
  });

  win.webContents.on('new-window', function (event, link) {
    event.preventDefault();
    const { protocol } = url.parse(link);
    if (protocol === 'http:' || protocol === 'https:') {
      open(link);
    }
  });
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (!win) {
    createWindow();
  }
});

app.on('ready', () => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const uri = request.url.substr(8);
    let { pathname } = url.parse(uri);
    const isOklinePath = uri.includes('okline/');
    const bundlePath = path.resolve(__dirname, './bundle');
    let filePath = `/${uri}`;
    pathname = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    filePath = path.resolve(isOklinePath ? __dirname : bundlePath, pathname);
    callback({ path: filePath });
  });

  protocol.interceptBufferProtocol('http', (request, callback) => {
    if (envConfig.isOkexchainUrl(request.url)) {
      fs.readFile(
        path.resolve(__dirname, './bundle/index.html'),
        'utf8',
        function (err, html) {
          callback(Buffer.from(html, 'utf8'));
        }
      );
    }
  });

  createWindow();
});
