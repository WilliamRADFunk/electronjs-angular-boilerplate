const { app, BrowserWindow, Tray } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;
let tray;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // load the dist folder from Angular
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // The following is optional and will open the DevTools:
  // mainWindow.webContents.openDevTools()

  mainWindow.on("closed", onClose);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

function onActivate() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
}

function onClose() {
  // Dereference the window object.
  mainWindow = null;
}

function onReady() {
  // Create a new tray
  tray = new Tray(path.join(__dirname, '/dist', 'assets', 'images', 'electron-icon.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', function (event) {
    toggleWindow();
  });

  createWindow();
  mainWindow.on('closed', onClose);
}

function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
      app.quit();
  }
}

function showWindow() {
  mainWindow.show();
  mainWindow.focus();
};

function toggleWindow() {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

app.on("ready", onReady);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", onWindowAllClosed);

// initialize the app's main window
app.on("activate", onActivate);
