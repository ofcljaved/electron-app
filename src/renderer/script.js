const { ipcRenderer } = require("electron");
console.log("Renderer process running");

document.getElementById("submit").addEventListener("click", () => {
  ipcRenderer.send("print-to-pdf");
});
