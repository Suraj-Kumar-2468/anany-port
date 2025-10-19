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
  isRunning?: boolean;
  ctaText?: string;
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
      onClick: () => onItemClick('finder'),
      isRunning: true,
      ctaText: 'Browse my portfolio files and projects'
    },
    {
      id: 'work',
      name: 'Work Projects',
      icon: <MacOSIcon name="work" size={50} />,
      onClick: () => onItemClick('work'),
      isRunning: false,
      ctaText: 'View my professional work and case studies'
    },
    {
      id: 'facetime',
      name: 'Phone',
      icon: <MacOSIcon name="facetime" size={50} />,
      onClick: () => {
        const phoneNumber = '+91-9876543210';
        navigator.clipboard.writeText(phoneNumber);
        alert(`📞 Phone number copied: ${phoneNumber}\n\nFeel free to call me for any opportunities!`);
      },
      isRunning: false,
      ctaText: '+91-9876543210 - Click to copy my phone number'
    },
    {
      id: 'mail',
      name: 'Mail',
      icon: <MacOSIcon name="mail" size={50} />,
      onClick: () => {
        const email = 'ananydeep@example.com';
        const subject = 'Portfolio Inquiry';
        const body = 'Hi Anany, I found your portfolio and would like to discuss opportunities!';
        window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      },
      isRunning: false,
      ctaText: 'ananydeep@example.com - Send me an email'
    },
    {
      id: 'youtube-videos',
      name: 'YouTube Videos',
      icon: <MacOSIcon name="youtube" size={50} />,
      onClick: () => onItemClick('youtube-videos'),
      isRunning: false,
      ctaText: 'Watch my video editing work and tutorials'
    },
    {
      id: 'youtube-shorts',
      name: 'YouTube Shorts',
      icon: <MacOSIcon name="shorts" size={50} />,
      onClick: () => onItemClick('youtube-shorts'),
      isRunning: false,
      ctaText: 'Quick video edits and creative content'
    },
    {
      id: 'resume',
      name: 'Resume',
      icon: <MacOSIcon name="resume" size={50} />,
      onClick: () => {
        window.open('/resume.pdf', '_blank');
      },
      isRunning: false,
      ctaText: 'Download my complete resume PDF'
    },
    {
      id: 'messages',
      name: 'WhatsApp',
      icon: <MacOSIcon name="messages" size={50} />,
      onClick: () => {
        const phoneNumber = '+919876543210';
        const message = 'Hi Anany! I found your portfolio and would like to connect.';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
      },
      isRunning: false,
      ctaText: 'Message me on WhatsApp for quick chat'
    },
    {
      id: 'calendar',
      name: 'Schedule Meeting',
      icon: <MacOSIcon name="calendar" size={50} />,
      onClick: () => {
        // Open calendar scheduling link
        window.open('https://calendly.com/ananydeep', '_blank');
      },
      isRunning: false,
      ctaText: 'Schedule a meeting to discuss projects'
    },
    {
      id: 'trash',
      name: 'Trash',
      icon: <MacOSIcon name="trash-empty" size={50} />,
      onClick: () => onItemClick('trash'),
      isRunning: false,
      ctaText: 'Clean workspace - drag files here'
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
              position: 'relative',
            }}
          >
            {item.icon}
            
            {/* Running indicator dot */}
            {item.isRunning && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: '#007AFF',
                  boxShadow: '0 0 4px rgba(0, 122, 255, 0.5)',
                }}
              />
            )}
          </Box>
          
          {/* Enhanced Tooltip with CTA */}
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
                marginBottom: '12px',
                padding: '8px 12px',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                maxWidth: '200px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                {item.name}
              </div>
              <div style={{ 
                fontSize: '10px', 
                opacity: 0.8,
                fontStyle: 'italic'
              }}>
                {item.ctaText}
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </Box>
  );
};

export default MacOSDock;
