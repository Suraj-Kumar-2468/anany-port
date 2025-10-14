import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery } from '@mui/material';
import RightSection from './components/RightSection';
import MacOSMenuBar from './components/MacOSMenuBar';
import MobileInterface from './components/MobileInterface';
import portfolioData from './data/portfolioData.json';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    primary: {
      main: '#007AFF'
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
});

export interface DetailData {
  title: string;
  content: any;
  type: 'info' | 'project' | 'resume' | 'videos';
}

function App() {
  const [selectedSection, setSelectedSection] = useState<string>('work');
  const [detailData, setDetailData] = useState<DetailData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setDetailData(null); // Clear details when switching sections
  };

  const handleInfoClick = (data: DetailData) => {
    setDetailData(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh',
        backgroundColor: isMobile 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : '#e5e5e5',
        backgroundAttachment: 'fixed',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Mobile Interface */}
        {isMobile ? (
          <MobileInterface portfolioData={portfolioData} />
        ) : (
          <>
            {/* macOS Menu Bar */}
            <MacOSMenuBar />
            
            {/* Main Content Area with React Flow */}
            <RightSection 
              selectedSection={selectedSection}
              portfolioData={portfolioData}
              onInfoClick={handleInfoClick}
              detailData={detailData}
              onSectionChange={handleSectionClick}
            />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
