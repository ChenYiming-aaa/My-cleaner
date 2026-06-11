export interface ElectronAPI {
  startScan: (drives: string[]) => Promise<{ success: boolean; error?: string }>
  pauseScan: () => Promise<void>
  resumeScan: () => Promise<void>
  cancelScan: () => Promise<void>
  onScanProgress: (callback: (progress: import('./index').ScanProgress) => void) => () => void
  onScanComplete: (callback: (result: import('./index').ScanResult) => void) => () => void
  onScanError: (callback: (error: string) => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
