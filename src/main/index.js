import { app, BrowserWindow, screen, ipcMain, dialog } from "electron/main";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
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
  mainWindow.loadFile(join(__dirname, "../renderer/index.html"));

  ipcMain.on("print-to-pdf", async () => {
    const pdfPath = join(app.getPath("documents"), "form.pdf");
    const options = {
      marginTop: 0,
      printBackground: true,
      landscape: true,
    };
    try {
      const data = await mainWindow.webContents.printToPDF(options);
      writeFileSync(pdfPath, data);
      console.log(`PDF saved to ${pdfPath}`);
      dialog.showMessageBox(mainWindow, {
        type: "info",
        title: "PDF Saved",
        message: `PDF saved to ${pdfPath}`,
        buttons: ["OK"],
      });
    } catch (error) {
      console.error(`Failed to save PDF: ${error.message}`);
    }
  });
};

const start = async () => {
  await app.whenReady();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

start();
