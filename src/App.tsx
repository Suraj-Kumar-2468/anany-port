import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import LeftSidebar from './components/LeftSidebar';
import RightSection from './components/RightSection';
import DetailPanel from './components/DetailPanel';
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

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setDetailData(null); // Clear details when switching sections
  };

  const handleInfoClick = (data: DetailData) => {
    setDetailData(data);
  };

  const handleCloseDetail = () => {
    setDetailData(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Left Sidebar */}
        <Box sx={{ 
          width: 280, 
          backgroundColor: '#f8f8f8',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <LeftSidebar 
            portfolioData={portfolioData}
            selectedSection={selectedSection}
            onSectionClick={handleSectionClick}
            onInfoClick={handleInfoClick}
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ 
          flex: 1,
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }}>
          <RightSection 
            selectedSection={selectedSection}
            portfolioData={portfolioData}
            onInfoClick={handleInfoClick}
            detailData={detailData}
            onSectionChange={handleSectionClick}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
