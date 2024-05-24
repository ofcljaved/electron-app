import { app, BrowserWindow } from "electron/main";
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
  });
  win.loadFile("./index.html");
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
