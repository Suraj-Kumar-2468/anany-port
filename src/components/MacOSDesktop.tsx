import React from 'react';
import { Box, Typography } from '@mui/material';
import MacOSIcon from './MacOSIcon';

interface DesktopIcon {
  id: string;
  name: string;
  x: number;
  y: number;
  onClick?: () => void;
}

interface MacOSDesktopProps {
  onIconClick?: (iconId: string) => void;
}

const MacOSDesktop: React.FC<MacOSDesktopProps> = ({ onIconClick }) => {
  const desktopIcons: DesktopIcon[] = [
    {
      id: 'project-01',
      name: 'Project 01 (AboutMess)',
      x: 800,
      y: 180,
    },
    {
      id: 'project-02',
      name: 'Project 02 (Samplings)',
      x: 920,
      y: 90,
    },
    {
      id: 'project-03',
      name: 'Project 03 (Leafpress)',
      x: 920,
      y: 250,
    },
    {
      id: 'project-04',
      name: 'Project 04 (Amazon)',
      x: 880,
      y: 320,
    },
    {
      id: 'full-case-study',
      name: 'Full case study fig',
      x: 100,
      y: 260,
    },
    {
      id: 'absolutmess',
      name: 'AboutMess (Project 01)',
      x: 100,
      y: 180,
    },
  ];

  const handleIconClick = (iconId: string) => {
    if (onIconClick) {
      onIconClick(iconId);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24, // Below menu bar
        left: 0,
        right: 0,
        bottom: 80, // Above dock
        backgroundColor: '#e5e5e5',
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <Box
          key={icon.id}
          sx={{
            position: 'absolute',
            left: icon.x,
            top: icon.y,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            '&:hover': {
              '& .icon-label': {
                backgroundColor: 'rgba(0, 122, 255, 0.8)',
                color: 'white',
              }
            }
          }}
          onClick={() => handleIconClick(icon.id)}
        >
          <MacOSIcon name="folder" size={64} />
          <Typography
            className="icon-label"
            variant="caption"
            sx={{
              mt: 0.5,
              fontSize: '11px',
              color: '#000',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              padding: '2px 6px',
              borderRadius: '4px',
              textAlign: 'center',
              maxWidth: '80px',
              wordWrap: 'break-word',
              lineHeight: 1.2,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            {icon.name}
          </Typography>
        </Box>
      ))}

      {/* Yellow sticky note */}
      <Box
        sx={{
          position: 'absolute',
          left: 20,
          top: 40,
          width: 80,
          height: 120,
          backgroundColor: '#FFE066',
          borderRadius: '2px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          p: 1,
          transform: 'rotate(-2deg)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '10px',
            color: '#333',
            lineHeight: 1.3,
            fontFamily: 'Marker Felt, cursive, -apple-system',
          }}
        >
          creating my mind
          artist
          -
          posts
          -
          my year
        </Typography>
      </Box>

      {/* Don't Look file icon */}
      <Box
        sx={{
          position: 'absolute',
          right: 40,
          bottom: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <MacOSIcon name="document" size={48} />
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            fontSize: '11px',
            color: '#000',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Don't Look
        </Typography>
      </Box>
    </Box>
  );
};

export default MacOSDesktop;
