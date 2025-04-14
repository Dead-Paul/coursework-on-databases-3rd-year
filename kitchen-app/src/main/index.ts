import Database from 'better-sqlite3';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.on('ready-to-show', mainWindow.show);

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
};

const database = new Database(path.join(app.getAppPath(), 'resources', 'db', 'kitchen.db'))
ipcMain.handle('database', async (_ : Electron.IpcMainInvokeEvent, source: string, params?: any[]) => (
        source.split(' ')[0].toUpperCase() == 'SELECT'
            ? database.prepare(source).all(...(params || [])) 
            : database.prepare(source).run(...(params || []))
));

app.whenReady().then(createWindow);