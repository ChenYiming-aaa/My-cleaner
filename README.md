# Deep Cleaner V2

一个基于 Electron + React + TypeScript 构建的 Windows 系统清理工具。

## ✨ 功能特性

- **驱动器检测** - 自动检测系统所有驱动器
- **文件扫描** - 快速扫描指定驱动器的文件
- **文件分类** - 自动分类缓存、日志、安装包等
- **风险评估** - 标识文件删除风险等级
- **批量删除** - 支持按类别批量删除文件

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🏗️ 技术架构

- **前端**: React 18 + TypeScript + Tailwind CSS + Framer Motion
- **后端**: Electron + Node.js
- **构建**: Vite + vite-plugin-electron

### 核心设计

1. **驱动器检测**: 使用 `fs.accessSync` 直接检测驱动器存在性，配合 `wmic` 获取详细信息
2. **文件扫描**: 使用 `fs.readdirSync` 同步读取目录，避免异步复杂性
3. **IPC 通信**: 简化的 IPC 接口设计

## 📁 项目结构

```
deep-cleaner-v2/
├── electron/
│   ├── main.ts          # Electron 主进程
│   └── preload.ts       # 预加载脚本
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx         # React 入口
│   ├── index.css        # 全局样式
│   └── electron.d.ts    # 类型定义
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 📦 构建

```bash
# 构建生产版本
npm run build
```

## 📄 许可证

MIT
