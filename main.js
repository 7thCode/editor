const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  const menuLabel = 'File';

  const template = [
    {
      label: 'Editor',
      submenu: [
        { label: 'About', role: 'about' }
      ]
    },
    {
      label: menuLabel,
      submenu: [
        {
          label: 'Load',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
              properties: ['openFile']
            });
            if (!canceled && filePaths && filePaths[0]) {
              fs.readFile(filePaths[0], 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  return;
                }
                win.webContents.send('file-opened', data);
              });
            }
          }
        },
        {
          label: 'Save',
          click: () => {
            win.webContents.send('request-save');
          }
        },
        {
          label: 'Quit',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

ipcMain.on('save-content', async (_event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: 'Untitled.txt'
  });
  if (!canceled && filePath) {
    fs.writeFile(filePath, data, 'utf8', err => {
      if (err) {
        console.error(err);
      }
    });
  }
});
