const electron = require('electron')
const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = electron
let mainWindow
let addWindow
function createAddWindow() {
    addWindow = new BrowserWindow({width: 400, height: 300, resizable: false, webPreferences: {nodeIntegration: true}})
    addWindow.loadFile('addWindow.html')
    addWindow.on('close', function(){
        addWindow = null
    })
}
function createWindow() {
    // the size of a Chrome window, without the option to resize (we will go over in later lessons)
    mainWindow = new BrowserWindow({width: 800, height: 600, resizable: false, webPreferences: {nodeIntegration: true}})
    // load index.html into our window
    mainWindow.loadFile('index.html')
    // build the menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    // insert menu into html
    Menu.setApplicationMenu(mainMenu)
    // add a listener to see if the main window has been closed
    mainWindow.on('closed', function(){
        app.quit()
    })
}
app.on('ready', createWindow)
ipcMain.on('item:add', function(event, item) {
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow()
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Cmd + Q' : 'Ctrl + Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
]