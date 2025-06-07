import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Input = styled('input')({
  display: 'none',
});

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '400px',
  objectFit: 'contain',
});

interface AnalysisResult {
  class: string;
  confidence: number;
  details: string;
  regions?: { bbox: number[]; confidence: number }[];
}

interface ImageAnalysisProps {
  onAnalysisComplete?: (imageUrl: string, result: AnalysisResult) => void;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('请选择图片文件');
        return;
      }
      setSelectedFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError('请先选择图片');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status === 'error') {
        setError(result.message || '分析失败');
        setIsAnalyzing(false);
        return;
      }

      setAnalysisResult(result.predictions);
      if (onAnalysisComplete && previewUrl) {
        onAnalysisComplete(previewUrl, result.predictions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析过程中出现错误');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, onAnalysisComplete, previewUrl]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        图像分析
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <label htmlFor="image-upload">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={isAnalyzing}
                >
                  选择图片
                </Button>
              </label>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                支持 JPG、PNG 格式的智云析理病理诊断平台切片图像
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {previewUrl ? (
              <Box sx={{ textAlign: 'center' }}>
                <ImagePreview src={previewUrl} alt="预览图" />
              </Box>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  图片预览区域
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            startIcon={isAnalyzing ? <CircularProgress size={20} /> : null}
          >
            {isAnalyzing ? '分析中...' : '开始分析'}
          </Button>
        </Box>
      </Paper>

      {/* 分析结果区域 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          分析结果
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
                {analysisResult.regions.map((region: any, index: number) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      区域 {index + 1}：
                      位置 [{region.bbox.join(', ')}]，
                      置信度 {(region.confidence * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary">
            {isAnalyzing ? '正在分析中...' : '请上传图片并点击"开始分析"按钮'}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ImageAnalysis; 