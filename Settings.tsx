import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

interface SettingsProps {
  savePath: string;
  onSavePathChange: (newPath: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ savePath, onSavePathChange }) => {
  const [inputPath, setInputPath] = useState(savePath);

  // 选择文件夹（实际应通过 Electron 主进程 dialog 实现，这里预留）
  const handleChooseFolder = async () => {
    // 这里应通过 window.electronAPI 或 ipcRenderer.invoke('choose-folder') 实现
    // 这里只做前端演示
    const newPath = prompt('请输入新的保存路径', inputPath);
    if (newPath) {
      setInputPath(newPath);
      onSavePathChange(newPath);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        系统设置
      </Typography>
      <Paper sx={{ p: 3, mb: 3, maxWidth: 600 }}>
        <Typography variant="subtitle1" gutterBottom>
          诊断报告保存路径
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="保存路径"
            value={inputPath}
            onChange={e => setInputPath(e.target.value)}
            fullWidth
            size="small"
          />
          <Button variant="outlined" onClick={handleChooseFolder}>
            选择文件夹
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings; 