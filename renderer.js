const { ipcRenderer } = require('electron');

const textarea = document.getElementById('editor');

ipcRenderer.on('file-opened', (_event, data) => {
  textarea.value = data;
});

ipcRenderer.on('request-save', () => {
  ipcRenderer.send('save-content', textarea.value);
});
