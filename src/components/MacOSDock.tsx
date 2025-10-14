import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import MacOSIcon from './MacOSIcon';

interface DockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface MacOSDockProps {
  onItemClick: (itemId: string) => void;
}

const MacOSDock: React.FC<MacOSDockProps> = ({ onItemClick }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const dockItems: DockItem[] = [
    {
      id: 'finder',
      name: 'Finder',
      icon: <MacOSIcon name="finder" size={50} />,
      onClick: () => onItemClick('finder')
    },
    {
      id: 'work',
      name: 'Work Projects',
      icon: <MacOSIcon name="work" size={50} />,
      onClick: () => onItemClick('work')
    },
    {
      id: 'resume',
      name: 'Resume',
      icon: <MacOSIcon name="resume" size={50} />,
      onClick: () => {
        window.open('/resume.pdf', '_blank');
      }
    },
    {
      id: 'youtube-videos',
      name: 'YouTube Videos',
      icon: <MacOSIcon name="youtube" size={50} />,
      onClick: () => onItemClick('youtube-videos')
    },
    {
      id: 'youtube-shorts',
      name: 'YouTube Shorts',
      icon: <MacOSIcon name="shorts" size={50} />,
      onClick: () => onItemClick('youtube-shorts')
    },
    {
      id: 'about',
      name: 'About Me',
      icon: <MacOSIcon name="about" size={50} />,
      onClick: () => onItemClick('about')
    },
    {
      id: 'launchpad',
      name: 'Launchpad',
      icon: <MacOSIcon name="launchpad" size={50} />,
      onClick: () => onItemClick('launchpad')
    },
    {
      id: 'mail',
      name: 'Mail',
      icon: <MacOSIcon name="mail" size={50} />,
      onClick: () => onItemClick('mail')
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: <MacOSIcon name="calendar" size={50} />,
      onClick: () => onItemClick('calendar')
    },
    {
      id: 'photos',
      name: 'Photos',
      icon: <MacOSIcon name="photos" size={50} />,
      onClick: () => onItemClick('photos')
    },
    {
      id: 'music',
      name: 'Music',
      icon: <MacOSIcon name="music" size={50} />,
      onClick: () => onItemClick('music')
    },
    {
      id: 'settings',
      name: 'System Preferences',
      icon: <MacOSIcon name="settings" size={50} />,
      onClick: () => onItemClick('settings')
    },
    {
      id: 'trash',
      name: 'Trash',
      icon: <MacOSIcon name="trash-empty" size={50} />,
      onClick: () => onItemClick('trash')
    }
  ];

  const getScale = (itemId: string, index: number) => {
    if (!hoveredItem) return 1;
    
    const hoveredIndex = dockItems.findIndex(item => item.id === hoveredItem);
    const distance = Math.abs(index - hoveredIndex);
    
    if (distance === 0) return 1.3;
    if (distance === 1) return 1.15;
    if (distance === 2) return 1.05;
    return 1;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'end',
        gap: 2,
        padding: '12px 20px',
        backgroundColor: 'rgba(128, 128, 128, 0.3)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {dockItems.map((item, index) => (
        <motion.div
          key={item.id}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={item.onClick}
          animate={{
            scale: getScale(item.id, index),
            y: hoveredItem === item.id ? -10 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          style={{
            cursor: 'pointer',
            transformOrigin: 'bottom',
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {item.icon}
          </Box>
          
          {/* Tooltip */}
          {hoveredItem === item.id && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {item.name}
            </motion.div>
          )}
        </motion.div>
      ))}
    </Box>
  );
};

export default MacOSDock;
