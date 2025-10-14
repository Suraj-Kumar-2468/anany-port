import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import MacOSIcon from './MacOSIcon';
import MacOSNotesNode from './nodes/MacOSNotesNode';

interface MobileInterfaceProps {
  portfolioData: any;
}

const MobileInterface: React.FC<MobileInterfaceProps> = ({ portfolioData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('work');
  const [showNotes, setShowNotes] = useState(false);
  const [notesContent, setNotesContent] = useState<{
    title: string;
    content: string;
    type: 'about' | 'project' | 'experience';
  } | null>(null);

  if (!isMobile) {
    return null; // Don't render on desktop
  }

  // Bottom Navigation Tabs
  const bottomNavItems = [
    {
      id: 'work',
      name: 'Work',
      icon: 'work',
      onClick: () => setActiveTab('work')
    },
    {
      id: 'videos',
      name: 'Videos',
      icon: 'youtube',
      onClick: () => setActiveTab('videos')
    },
    {
      id: 'shorts',
      name: 'Shorts',
      icon: 'shorts',
      onClick: () => setActiveTab('shorts')
    },
    {
      id: 'resume',
      name: 'Resume',
      icon: 'resume',
      onClick: () => {
        window.open('/resume.pdf', '_blank');
      }
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'work':
        return (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            justifyItems: 'center',
            p: 3,
          }}>
            {portfolioData.sections.work.projects.map((project: any) => (
              <Box
                key={project.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(0.95)',
                  }
                }}
                onClick={() => {
                  setNotesContent({
                    title: project.name,
                    content: `📁 ${project.name}\n\n📋 Project Type: ${project.type}\n\n📝 Description:\n${project.description}\n\n🏷️ Tags:\n${project.tags?.join(', ') || 'N/A'}\n\n📊 Statistics:\n${Object.entries(project.stats || {}).map(([key, value]) => `• ${key}: ${value}`).join('\n')}\n\n🔗 Link: ${project.link}`,
                    type: 'project'
                  });
                  setShowNotes(true);
                }}
              >
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '13px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  mb: 0.5,
                }}>
                  <MacOSIcon name="folder" size={40} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '12px',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 400,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {project.name}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      
      case 'videos':
        return (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            justifyItems: 'center',
            p: 3,
          }}>
            {portfolioData.videos.fullLength.map((video: any) => (
              <Box
                key={video.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(0.95)',
                  }
                }}
                onClick={() => {
                  setNotesContent({
                    title: video.title,
                    content: `📺 ${video.title}\n\n👀 Views: ${video.views}\n⏱️ Duration: ${video.duration}\n\n🔗 Video URL: ${video.url}`,
                    type: 'project'
                  });
                  setShowNotes(true);
                }}
              >
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '13px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  mb: 0.5,
                }}>
                  <MacOSIcon name="youtube" size={40} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '12px',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 400,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {video.title}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      
      case 'shorts':
        return (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            justifyItems: 'center',
            p: 3,
          }}>
            {portfolioData.videos.shorts.map((video: any) => (
              <Box
                key={video.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(0.95)',
                  }
                }}
                onClick={() => {
                  setNotesContent({
                    title: video.title,
                    content: `🩳 ${video.title}\n\n👀 Views: ${video.views}\n\n🔗 Video URL: ${video.url}`,
                    type: 'project'
                  });
                  setShowNotes(true);
                }}
              >
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '13px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  mb: 0.5,
                }}>
                  <MacOSIcon name="shorts" size={40} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '12px',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 400,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {video.title}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (showNotes && notesContent) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
        }}
      >
        <MacOSNotesNode
          data={{
            ...notesContent,
            onClose: () => setShowNotes(false)
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      {/* iOS Status Bar */}
      <Box
        sx={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          color: 'white',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '17px' }}>
          9:41
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {/* Signal bars */}
          <Box sx={{ display: 'flex', gap: '2px', alignItems: 'end' }}>
            <Box sx={{ width: 3, height: 4, backgroundColor: 'white', borderRadius: '1px' }} />
            <Box sx={{ width: 3, height: 6, backgroundColor: 'white', borderRadius: '1px' }} />
            <Box sx={{ width: 3, height: 8, backgroundColor: 'white', borderRadius: '1px' }} />
            <Box sx={{ width: 3, height: 10, backgroundColor: 'white', borderRadius: '1px' }} />
          </Box>
          {/* WiFi */}
          <Box sx={{ ml: 1 }}>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
              <path d="M1.5 4.5C3.5 2.5 6.5 2.5 8.5 4.5M3 7C4 6 6 6 7 7M4.5 9.5L4.5 9.5"/>
            </svg>
          </Box>
          {/* Battery */}
          <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 24, 
              height: 11, 
              border: '1px solid white', 
              borderRadius: '2px', 
              position: 'relative',
              mr: 0.5
            }}>
              <Box sx={{ 
                width: '80%', 
                height: '100%', 
                backgroundColor: 'white', 
                borderRadius: '1px' 
              }} />
            </Box>
            <Box sx={{ 
              width: 2, 
              height: 6, 
              backgroundColor: 'white', 
              borderRadius: '0 1px 1px 0' 
            }} />
          </Box>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderTabContent()}
      </Box>

      {/* iOS Bottom Navigation */}
      <Box
        sx={{
          height: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(30px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          px: 4,
          pb: 3,
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px',
        }}
      >
        {bottomNavItems.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              opacity: activeTab === item.id ? 1 : 0.7,
              transition: 'all 0.3s ease',
              p: 1,
              borderRadius: '12px',
              backgroundColor: activeTab === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
            onClick={item.onClick}
          >
            <MacOSIcon name={item.icon} size={28} />
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                fontSize: '10px',
                fontWeight: activeTab === item.id ? 600 : 400,
                color: activeTab === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MobileInterface;
