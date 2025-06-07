import React, { useState} from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Divider, Snackbar, Alert } from '@mui/material';

interface AnalysisResult {
  class: string;
  confidence: number;
  details: string;
  regions?: { bbox: number[]; confidence: number }[];
}

interface ReportProps {
  imageUrl?: string;
  analysisResult?: AnalysisResult | null;
  defaultSavePath?: string;
}

const Report: React.FC<ReportProps> = ({ imageUrl, analysisResult, defaultSavePath }) => {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [doctorOpinion, setDoctorOpinion] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // 保存诊断报告到本地
  const handleSave = async () => {
    if (!patientId) {
      setSaveError('请填写病人编号');
      return;
    }
    // 构造报告内容
    const report = {
      patientName,
      patientId,
      doctorOpinion,
      analysisResult,
      date: new Date().toLocaleString(),
    };
    try {
      // 通过 Electron 的 IPC 保存到本地
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      if (ipcRenderer) {
        const res = await ipcRenderer.invoke('save-report', {
          content: JSON.stringify(report, null, 2),
          savePath: defaultSavePath || '',
          fileName: `${patientId}_report.json`,
        });
        if (res.success) {
          setSaveSuccess(true);
          setPatientName('');
          setPatientId('');
          setDoctorOpinion('');
        } else {
          setSaveError(res.error || '保存失败');
        }
      } else {
        setSaveError('未检测到 Electron 环境，无法保存到本地');
      }
    } catch (e) {
      setSaveError('保存失败');
    }
  };

  const handleExportPDF = async () => {
    try {
      const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };
      if (ipcRenderer) {
        const res = await ipcRenderer.invoke('print-to-pdf', {
          savePath: defaultSavePath || '',
          fileName: `${patientId || '诊断报告'}_report.pdf`,
        });
        if (res.success) {
          setSaveSuccess(true);
        } else {
          setSaveError(res.error || '导出PDF失败');
        }
      } else {
        setSaveError('未检测到 Electron 环境，无法导出PDF');
      }
    } catch (e) {
      setSaveError('导出PDF失败');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        诊断报告
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="病人姓名"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="病人编号"
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              病理图像
            </Typography>
            {imageUrl ? (
              <img src={imageUrl} alt="病理图像" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
            ) : (
              <Typography color="textSecondary">暂无图片</Typography>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          平台分析结果
        </Typography>
        {analysisResult ? (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              诊断类别：{analysisResult.class}
            </Typography>
            <Typography variant="body1" gutterBottom>
              置信度：{(analysisResult.confidence * 100).toFixed(2)}%
            </Typography>
            <Typography variant="body1" gutterBottom>
              详细说明：{analysisResult.details}
            </Typography>
            {analysisResult.regions && analysisResult.regions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  检测到的病理区域：
                </Typography>
                {analysisResult.regions.map((region, idx) => (
                  <Typography variant="body2" key={idx}>
                    区域 {idx + 1}：位置 [{region.bbox.join(', ')}]，置信度 {(region.confidence * 100).toFixed(2)}%
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        ) : (
          <Typography color="textSecondary">暂无分析结果</Typography>
        )}
        <Divider sx={{ my: 3 }} />
        <TextField
          label="医师意见"
          value={doctorOpinion}
          onChange={e => setDoctorOpinion(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          margin="normal"
        />
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            保存报告
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleExportPDF} sx={{ ml: 2 }}>
            导出为PDF
          </Button>
        </Box>
      </Paper>
      <Snackbar open={saveSuccess} autoHideDuration={2000} onClose={() => setSaveSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          保存成功！
        </Alert>
      </Snackbar>
      <Snackbar open={!!saveError} autoHideDuration={3000} onClose={() => setSaveError('')}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {saveError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Report; 