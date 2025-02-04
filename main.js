const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const dosya_yolu = path.join(__dirname, 'notlarim.json');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


ipcMain.handle('get-note', () => {
  if (fs.existsSync(dosya_yolu)) {
    const notlarimData = fs.readFileSync(dosya_yolu);
    return JSON.parse(notlarimData);
  } else {
    return [];
  }
});


ipcMain.handle('add-note', (event, newNote) => {
  const notlarim = fs.existsSync(dosya_yolu) ? JSON.parse(fs.readFileSync(dosya_yolu)) : [];
  notlarim.push(newNote);
  fs.writeFileSync(dosya_yolu, JSON.stringify(notlarim, null, 2));
  return notlarim;
});


ipcMain.handle('edit-note', (event, { index, note }) => {
  const notlarim = JSON.parse(fs.readFileSync(dosya_yolu));
  notlarim[index] = note;
  fs.writeFileSync(dosya_yolu, JSON.stringify(notlarim, null, 2));
  return notlarim;
});

ipcMain.handle('delete-note', (event, index) => {
  const notlarim = JSON.parse(fs.readFileSync(dosya_yolu));
  notlarim.splice(index, 1);
  fs.writeFileSync(dosya_yolu, JSON.stringify(notlarim, null, 2));
  return notlarim;
});
