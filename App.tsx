import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Image as ImageIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import ImageAnalysis from './components/ImageAnalysis';
import logo2 from './assets/logo2.png';
import schoolLogo from './assets/schoollogo.jpg';
import Report from './components/Report';
import Settings from './components/Settings';

const drawerWidth = 270;

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 全局存储分析图片和结果
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // 全局保存路径，默认桌面
  const [savePath, setSavePath] = useState<string>(() => {
    // Electron 环境下可用 process.env.HOME 或 USERPROFILE
    const userHome = (window as any).process?.env?.USERPROFILE || (window as any).process?.env?.HOME || '';
    return userHome ? `${userHome}/Desktop` : '';
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: '仪表盘', icon: <DashboardIcon />, id: 'dashboard' },
    { text: '图像分析', icon: <ImageIcon />, id: 'image-analysis' },
    { text: '诊断报告', icon: <AssessmentIcon />, id: 'reports' },
    { text: '系统设置', icon: <SettingsIcon />, id: 'settings' },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'image-analysis':
        return <ImageAnalysis onAnalysisComplete={(imgUrl, result) => { setAnalysisImageUrl(imgUrl); setAnalysisResult(result); }} />;
      case 'reports':
        return <Report imageUrl={analysisImageUrl} analysisResult={analysisResult} defaultSavePath={savePath} />;
      case 'settings':
        return <Settings savePath={savePath} onSavePathChange={setSavePath} />;
      case 'dashboard':
      default:
        return (
          <Container maxWidth="lg">
            <Typography variant="h5" gutterBottom>
              仪表盘
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography paragraph>
                欢迎使用智云析理病理诊断平台。请选择左侧菜单开始使用。
              </Typography>
            </Paper>
          </Container>
        );
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Toolbar sx={{ minHeight: 'auto', alignItems: 'center', justifyContent: 'center', py: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: '18px',
            whiteSpace: 'normal',
            wordBreak: 'break-all',
            lineHeight: 1.2,
            overflow: 'visible',
            textOverflow: 'unset',
            display: 'block',
            textAlign: 'center',
            width: '100%',
          }}
        >
          智云析理病理诊断平台
        </Typography>
      </Toolbar>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => setCurrentPage(item.id)}
            selected={currentPage === item.id}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      {/* logo区 */}
      <Box sx={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}>
        <img src={logo2} alt="项目组logo" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 18 }} />
        <img src={schoolLogo} alt="学校logo" style={{ width: 180, height: 65, objectFit: 'contain' }} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            智云析理病理诊断平台
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default App; 