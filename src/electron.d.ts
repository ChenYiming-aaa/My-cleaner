export interface ElectronAPI {
  getDrives: () => Promise<{ success: boolean; drives: any[] }>
  scanFiles: (drives: string[]) => Promise<{ files: any[]; totalFiles: number; duration: number }>
  deleteFiles: (filePaths: string[]) => Promise<{ success: number; failed: number }>
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
