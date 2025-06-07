# 智云析理病理诊断平台  
## 软件结构与功能说明

---

## 一、项目简介

"智云析理病理诊断平台"是一款基于 Electron + React + TypeScript + Material-UI 技术栈开发的现代化桌面应用，面向病理图像的智能分析与辅助诊断。平台支持多种病理图像的上传、预览、分析，并可扩展集成AI模型，适用于医院、科研院所及高校实验室等场景。

---

## 二、项目结构

```
kgplat/
├── src/
│   ├── App.tsx                # 主界面与路由、侧边栏、logo等
│   ├── main.ts                # Electron 主进程入口
│   ├── index.tsx              # React 应用入口
│   ├── index.css              # 全局样式
│   ├── global.d.ts            # 静态资源类型声明
│   ├── assets/                # 静态资源（logo图片等）
│   │    ├── logo2.png         # 项目组logo
│   │    └── schoollogo.jpg    # 学校logo
│   └── components/
│        └── ImageAnalysis.tsx # 图像分析功能组件
├── dist/                      # 编译输出目录
├── package.json               # 项目依赖与脚本
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── index.html                 # HTML模板
```

---

## 三、主要功能

### 1. 主界面与导航
- 左侧为侧边栏，包含平台标题、功能菜单（仪表盘、图像分析、诊断报告、系统设置）及底部logo区。
- 顶部为当前页面标题栏，风格参考 Google Material Design。

### 2. 图像分析
- 支持 JPG、PNG 等格式的病理切片图像上传。
- 图片上传后可预览，支持后续集成AI模型进行自动分析。
- 分析结果区域可展示模型推理结果、诊断建议等。

### 3. 诊断报告
- 预留诊断报告页面，可扩展为分析结果的结构化展示、导出PDF等功能。

### 4. 系统设置
- 预留系统设置页面，可扩展为模型参数配置、用户管理等功能。

### 5. 品牌展示
- 侧边栏底部展示项目组logo和学校logo，提升品牌与归属感。

---

## 四、技术栈

- Electron：跨平台桌面应用开发
- React：现代前端UI框架
- TypeScript：类型安全开发
- Material-UI (MUI)：Google风格UI组件库
- Vite：极速前端构建工具

---

## 四、依赖安装与环境说明

### 1. 安装依赖

建议在 Python 3.10 环境下，进入 model_service 目录，执行：

```
pip install -r requirements.txt
```

#### 国内用户加速建议

如遇到依赖下载缓慢或安装失败，推荐使用清华镜像源加速（尤其是 torch/torchvision）：

```
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

或单独安装 PyTorch：

```
pip install torch==2.0.1 torchvision==0.15.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

---

## 五、开发与运行

### 安装依赖
```bash
npm install
```

### 开发模式（推荐）
```bash
npx tsc         # 编译主进程
npm start       # 启动Electron桌面应用
```

### 打包构建
```bash
npm run build   # 前端+主进程一起构建
npm start       # 启动生产环境
```

---

## 六、扩展与定制

- 可集成自研或第三方AI病理诊断模型（如Python服务、REST API等）。
- 可扩展更多功能模块，如病例管理、用户权限、数据统计等。
- UI风格可根据实际需求进一步美化和定制。

