import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  selectedDrives: string[]
  scanDepth: 'quick' | 'deep' | 'custom'
  autoSelectSafe: boolean

  useRecycleBin: boolean
  confirmBeforeClean: boolean

  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'

  quickActions: string[]

  setSelectedDrives: (drives: string[]) => void
  setScanDepth: (depth: 'quick' | 'deep' | 'custom') => void
  setAutoSelectSafe: (auto: boolean) => void
  setUseRecycleBin: (use: boolean) => void
  setConfirmBeforeClean: (confirm: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: 'zh-CN' | 'en-US') => void
  setQuickActions: (actions: string[]) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedDrives: ['C:'],
      scanDepth: 'deep',
      autoSelectSafe: true,
      useRecycleBin: true,
      confirmBeforeClean: true,
      theme: 'light',
      language: 'zh-CN',
      quickActions: ['scan', 'large-files', 'duplicates', 'registry'],

      setSelectedDrives: (drives: string[]) => set({ selectedDrives: drives }),
      setScanDepth: (depth) => set({ scanDepth: depth }),
      setAutoSelectSafe: (auto) => set({ autoSelectSafe: auto }),
      setUseRecycleBin: (use) => set({ useRecycleBin: use }),
      setConfirmBeforeClean: (confirm) => set({ confirmBeforeClean: confirm }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (lang) => set({ language: lang }),
      setQuickActions: (actions) => set({ quickActions: actions }),
    }),
    {
      name: 'deep-cleaner-settings',
    }
  )
)
