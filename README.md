# 倒数日 PWA 应用

一个简洁美观的倒数日应用，支持在安卓手机上安装为原生应用体验。

## 功能特点

- 📱 **PWA 支持**: 可安装到手机桌面，提供原生应用体验
- 🎨 **现代化设计**: 渐变色彩，响应式布局
- 💾 **本地存储**: 数据保存在本地，无需网络连接
- 🔄 **离线功能**: 通过 Service Worker 支持离线使用
- 📅 **智能排序**: 自动按日期远近排序倒数日
- 🗑️ **便捷管理**: 一键删除不需要的倒数日

## 使用方法

### 1. 生成应用图标

首先需要生成PWA所需的图标文件：

1. 在浏览器中打开 `generate-icons.html`
2. 右键点击每个图标，选择"图片另存为"
3. 按照页面显示的文件名保存图标（如 `icon-192x192.png`）

### 2. 启动应用

由于PWA需要HTTPS或localhost环境，你可以使用以下方法之一：

#### 方法一：使用Python简单服务器
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 方法二：使用Node.js服务器
```bash
npx http-server -p 8000
```

#### 方法三：使用PHP服务器
```bash
php -S localhost:8000
```

### 3. 访问应用

在浏览器中访问 `http://localhost:8000`

### 4. 安装到手机

1. 在手机浏览器中访问应用
2. 浏览器会提示"添加到主屏幕"或"安装应用"
3. 点击安装，应用图标将出现在桌面

## 部署到生产环境

### 使用 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 访问 `https://yourusername.github.io/repository-name`

### 使用 Netlify

1. 将代码推送到 Git 仓库
2. 在 Netlify 中连接仓库
3. 自动部署完成

### 使用 Vercel

1. 安装 Vercel CLI: `npm i -g vercel`
2. 在项目目录运行: `vercel`
3. 按提示完成部署

## 文件结构

```
ImDay/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js             # 应用逻辑
├── manifest.json      # PWA 配置
├── sw.js              # Service Worker
├── icon.svg           # 矢量图标
├── generate-icons.html # 图标生成器
├── icon-*.png         # 各尺寸PNG图标
└── README.md          # 说明文档
```

## 技术栈

- **HTML5**: 语义化标记
- **CSS3**: 现代样式，渐变，动画
- **JavaScript ES6+**: 模块化开发
- **PWA**: Service Worker, Web App Manifest
- **LocalStorage**: 本地数据存储

## 浏览器支持

- Chrome 67+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## 许可证

MIT License