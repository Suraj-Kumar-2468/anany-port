import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface MacOSMenuBarProps {
  onResetPositions?: () => void;
}

const MacOSMenuBar: React.FC<MacOSMenuBarProps> = ({ onResetPositions }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 24,
        backgroundColor: 'rgba(246, 246, 246, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        zIndex: 9999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Left side - Apple logo and menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Apple Logo */}
        <Box
          sx={{
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }
          }}
          onClick={onResetPositions}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M11.182 2.982c-.61.61-1.6.61-2.21 0-.61-.61-.61-1.6 0-2.21.61-.61 1.6-.61 2.21 0 .61.61.61 1.6 0 2.21zm-1.105 8.036c-.61.61-1.6.61-2.21 0-.61-.61-.61-1.6 0-2.21.61-.61 1.6-.61 2.21 0 .61.61.61 1.6 0 2.21zm-8.036-1.105c-.61.61-1.6.61-2.21 0-.61-.61-.61-1.6 0-2.21.61-.61 1.6-.61 2.21 0 .61.61.61 1.6 0 2.21z"
              fill="#000"
            />
            <path
              d="M9.5 7c0 1.38-1.12 2.5-2.5 2.5S4.5 8.38 4.5 7 5.62 4.5 7 4.5 9.5 5.62 9.5 7z"
              fill="#000"
            />
          </svg>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#000',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }
          }}
          onClick={() => {
            // Open contact modal or navigate to contact
            const email = 'ananydeep@example.com';
            const subject = 'Portfolio Contact';
            const body = 'Hi Anany, I found your portfolio and would like to get in touch!';
            window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          }}
        >
          Contact
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '13px',
            color: '#000',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }
          }}
          onClick={() => {
            window.open('/resume.pdf', '_blank');
          }}
        >
          Resume
        </Typography>
      </Box>

      {/* Right side - System status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Battery */}
        <Box
          sx={{
            width: 24,
            height: 12,
            border: '1px solid #000',
            borderRadius: '2px',
            position: 'relative',
            backgroundColor: '#4CAF50',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: -3,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 2,
              height: 6,
              backgroundColor: '#000',
              borderRadius: '0 1px 1px 0',
            }}
          />
        </Box>

        {/* WiFi */}
        <Box
          sx={{
            width: 16,
            height: 16,
            position: 'relative',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3C10.5 3 12.8 4.1 14.4 6L13 7.4C11.8 6.2 10 5.5 8 5.5S4.2 6.2 3 7.4L1.6 6C3.2 4.1 5.5 3 8 3Z"
              fill="#000"
            />
            <path
              d="M8 7C9.3 7 10.5 7.5 11.4 8.4L10 9.8C9.4 9.2 8.7 8.9 8 8.9S6.6 9.2 6 9.8L4.6 8.4C5.5 7.5 6.7 7 8 7Z"
              fill="#000"
            />
            <circle cx="8" cy="12" r="1.5" fill="#000" />
          </svg>
        </Box>

        {/* Bluetooth */}
        <Box
          sx={{
            width: 16,
            height: 16,
            position: 'relative',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8.5 2L11 4.5L9.5 6L11 7.5L8.5 10V6.5L7 8L6 7L8.5 4.5V2ZM8.5 14L6 11.5L7 10.5L8.5 12V9.5L11 12L8.5 14Z"
              fill="#007AFF"
            />
          </svg>
        </Box>

        {/* Date and Time */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '13px',
            color: '#000',
            fontWeight: 500,
            ml: 1,
          }}
        >
          {formatTime(currentTime)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MacOSMenuBar;
