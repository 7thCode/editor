const { ipcRenderer } = require('electron');

const textarea = document.getElementById('editor');
const editor = CodeMirror.fromTextArea(textarea, {
  mode: 'text/html',
  lineNumbers: true
});

ipcRenderer.on('file-opened', (_event, data) => {
  editor.setValue(data);
});

ipcRenderer.on('request-save', () => {
  ipcRenderer.send('save-content', editor.getValue());
});

ipcRenderer.on('request-save-current', () => {
  ipcRenderer.send('save-current', editor.getValue());
});

ipcRenderer.on('find-text', (_event, text) => {
  const index = editor.getValue().indexOf(text);
  if (index !== -1) {
    const start = editor.posFromIndex(index);
    const end = editor.posFromIndex(index + text.length);
    editor.focus();
    editor.setSelection(start, end);
  }
});

ipcRenderer.on('new-file', () => {
  editor.setValue('');
});
