import { app, BrowserWindow, screen, ipcMain, dialog } from 'electron/main';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile(join(__dirname, '../renderer/index.html'));

  ipcMain.on('print-to-pdf', () => {
    mainWindow.webContents.print(
      { silent: false, printBackground: true, landscape: true },
      (success, failureReason) => {
        if (!success) {
          console.error(`Failed to print: ${failureReason}`);
          dialog.showMessageBox(mainWindow, {
            type: 'error',
            title: 'Print Error',
            message: `Failed to print: ${failureReason}`,
            buttons: ['OK'],
          });
        } else {
          console.log('Print job sent successfully');
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Print Job',
            message: 'Print job sent successfully',
            buttons: ['OK'],
          });
        }
      }
    );
  });
};

const start = async () => {
  await app.whenReady();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

start();
