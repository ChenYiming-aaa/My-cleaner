import path from 'path'

/**
 * 获取文件扩展名
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase()
}

/**
 * 获取文件名（不含扩展名）
 */
export function getFileNameWithoutExtension(filePath: string): string {
  const name = path.basename(filePath)
  return name.substring(0, name.lastIndexOf('.')) || name
}

/**
 * 判断是否为可执行文件
 */
export function isExecutable(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  return ['.exe', '.msi', '.bat', '.cmd', '.ps1'].includes(ext)
}

/**
 * 判断是否为安装包
 */
export function isInstaller(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  const name = path.basename(filePath).toLowerCase()
  
  return (
    ['.exe', '.msi', '.msix', '.appx'].includes(ext) &&
    (name.includes('setup') || name.includes('install') || name.includes('update'))
  )
}

/**
 * 判断是否为临时文件
 */
export function isTempFile(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  const name = path.basename(filePath).toLowerCase()
  
  return (
    ['.tmp', '.temp', '.bak', '.old', '.dmp'].includes(ext) ||
    name.startsWith('~') ||
    filePath.toLowerCase().includes('\\temp\\') ||
    filePath.toLowerCase().includes('\\tmp\\')
  )
}

/**
 * 判断是否为缓存文件
 */
export function isCacheFile(filePath: string): boolean {
  const lowerPath = filePath.toLowerCase()
  return (
    lowerPath.includes('\\cache\\') ||
    lowerPath.includes('\\cached\\') ||
    lowerPath.includes('\\cookies\\') ||
    lowerPath.includes('\\history\\')
  )
}

/**
 * 判断是否为日志文件
 */
export function isLogFile(filePath: string): boolean {
  const ext = getFileExtension(filePath)
  return ['.log', '.etl', '.evtx', '.txt'].includes(ext)
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
