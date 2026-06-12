import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getDrives: () => ipcRenderer.invoke('get-drives'),
  scanFiles: (drives: string[]) => ipcRenderer.invoke('scan-files', drives),
  deleteFiles: (filePaths: string[]) => ipcRenderer.invoke('delete-files', filePaths),
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },
})
