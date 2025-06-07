@echo off
echo 启动智云析理病理诊断平台...

:: 检查是否已安装依赖
if not exist "model_service\venv" (
    echo 首次运行，正在安装依赖...
    call model_service\setup.bat
)

:: 启动 Python 模型服务
start cmd /k "cd model_service && call venv\Scripts\activate.bat && python main.py"

:: 等待 Python 服务启动
timeout /t 5

:: 启动 Electron 应用
start cmd /k "npm start"

echo 服务已启动！
echo Python 模型服务运行在 http://localhost:8000
echo Electron 应用将自动打开 