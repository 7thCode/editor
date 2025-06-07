const { ipcRenderer } = require('electron');

const textarea = document.getElementById('editor');

ipcRenderer.on('file-opened', (_event, data) => {
  textarea.value = data;
});

ipcRenderer.on('request-save', () => {
  ipcRenderer.send('save-content', textarea.value);
});

ipcRenderer.on('find-text', (_event, text) => {
  const index = textarea.value.indexOf(text);
  if (index !== -1) {
    textarea.focus();
    textarea.setSelectionRange(index, index + text.length);
  }
});

ipcRenderer.on('new-file', () => {
  textarea.value = '';
});
