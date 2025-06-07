const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');

function openSearchWindow(parent) {
  const searchWin = new BrowserWindow({
    width: 320,
    height: 120,
    parent,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const html = `<!DOCTYPE html>
  <html>
    <body>
      <input id="search-input" type="text" style="width:260px" autofocus />
      <button id="find-btn">Find</button>
      <button id="close-btn">Close</button>
      <script>
        const { ipcRenderer } = require('electron');
        const input = document.getElementById('search-input');

        document.getElementById('find-btn').addEventListener('click', () => {
          ipcRenderer.send('find-text', input.value);
        });
        document.getElementById('close-btn').addEventListener('click', () => {
          window.close();
        });
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            ipcRenderer.send('find-text', input.value);
          }
        });
      <\/script>
    </body>
  </html>`;

  searchWin.loadURL('data:text/html,' + encodeURIComponent(html));
}

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
    },
    {
      label: 'Find',
      submenu: [
        {
          label: 'Find...',
          click: () => openSearchWindow(win)
        }
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

ipcMain.on('find-text', (_event, text) => {
  const focused = BrowserWindow.getFocusedWindow();
  if (focused) {
    focused.getParentWindow()?.webContents.send('find-text', text);
  }
});
