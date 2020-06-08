'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// 用于接受最大化最小化关闭窗口信号
ipcMain.on('min-window', e => mainWindow.minimize());
ipcMain.on('max-window', e => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
});
ipcMain.on('close-window', e => mainWindow.close());

// 文件操作信号
// 打开文件
ipcMain.on('open-file-dialog', e => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    if (files) {
      e.sender.send('selectedFile', files)
    }
  })
});

// 新建文件
ipcMain.on('new-file', e => {
  e.sender.send('newFile', null)
});

// 更新树形目录相关
// 树形目录增加
ipcMain.on('filemenu-new-file', e => {
  e.sender.send('fileMenuNewFile', null)
});

// 树形目录移除
ipcMain.on('filemenu-remove-file', (e, args) => {
  e.sender.send('fileMenuRemoveFile', args)
});

// 通过标签页更新树形目录
ipcMain.on('change-file-menu-from-tab', (e, args) => {
  e.sender.send('changeFileMenuFromTab', args)
});

// 通过树形目录更新标签页
ipcMain.on('change-tab-from-file-menu', (e, args) => {
  e.sender.send('changeTabFromFileMenu', args)
});
