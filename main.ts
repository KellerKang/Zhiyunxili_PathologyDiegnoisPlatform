import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';

let splash: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcessWithoutNullStreams | null = null;

function startBackend() {
  // 自动启动 Python 后端服务
  const pythonExe = process.platform === 'win32' ? 'python' : 'python3';
  const backendPath = path.join(__dirname, '../model_service/main.py');
  let spawnOptions = {
    cwd: path.join(__dirname, '../model_service'),
    shell: true,
    detached: false,
  };

  // Windows 下检测 cmd.exe 是否存在
  if (process.platform === 'win32') {
    const cmdPath = 'C:\\Windows\\System32\\cmd.exe';
    if (!fs.existsSync(cmdPath)) {
      console.error('cmd.exe 不存在，后端服务无法自动启动。请检查系统环境。');
      return;
    }
  }

  try {
    backendProcess = spawn(pythonExe, [backendPath], spawnOptions);
    backendProcess.stdout.on('data', (data) => {
      console.log(`[后端] ${data}`);
    });
    backendProcess.stderr.on('data', (data) => {
      console.error(`[后端错误] ${data}`);
    });
    backendProcess.on('close', (code) => {
      console.log(`[后端] 进程退出，代码: ${code}`);
    });
  } catch (e) {
    console.error('启动后端服务失败:', e);
  }
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

function createWindow() {
  // 创建 splash 窗口
  splash = new BrowserWindow({
    width: 500,
    height: 420,
    frame: false,
    alwaysOnTop: true,
    transparent: false,
    resizable: false,
    show: true,
  });
  splash.loadFile(path.join(__dirname, '../splash.html'));

  // 创建主窗口，但先不显示
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '智云析理病理诊断平台',
    show: false,
    icon: path.join(__dirname, '../src/assets/logo2.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 在开发环境中加载本地服务器
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // 在生产环境中加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 主窗口加载完成后，关闭 splash，显示主窗口，并启动后端服务
  mainWindow.once('ready-to-show', () => {
    if (splash) splash.close();
    if (mainWindow) mainWindow.show();
    startBackend(); // 启动后端服务
  });

  // 当窗口关闭时停止后端服务
  mainWindow.on('closed', () => {
    stopBackend();
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 保存诊断报告 IPC 处理
ipcMain.handle('save-report', async (_event, { content, savePath, fileName }) => {
  try {
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    const filePath = path.join(savePath, fileName);
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, filePath };
  } catch (e) {
    return { success: false, error: (e instanceof Error ? e.message : '保存失败') };
  }
});

// 导出 PDF IPC 处理
ipcMain.handle('print-to-pdf', async (_event, { savePath, fileName }) => {
  try {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) throw new Error('未找到活动窗口');
    const pdfBuffer = await win.webContents.printToPDF({});
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    const filePath = path.join(savePath, fileName);
    fs.writeFileSync(filePath, pdfBuffer);
    return { success: true, filePath };
  } catch (e) {
    return { success: false, error: (e instanceof Error ? e.message : '导出PDF失败') };
  }
}); 