import React, { useState } from 'react';
import { Box, Typography, Link } from '@mui/material';

interface NotesAppProps {
  data: {
    title: string;
    content: string;
    type: 'about' | 'project' | 'experience';
    onClose: () => void;
  };
}

const MacOSNotesApp: React.FC<NotesAppProps> = ({ data }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    // Enhanced regex to catch more YouTube URL formats
    const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Function to parse content and make URLs clickable with YouTube player
  const parseContentWithLinks = (content: string) => {
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        const videoId = getYouTubeVideoId(part);
        
        if (videoId) {
          // Render YouTube player for YouTube URLs
          return (
            <Box key={index} sx={{ my: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  backgroundColor: '#000',
                  border: '1px solid #e1e5e9',
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                  }}
                />
              </Box>
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Link
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#007AFF',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#0051D5',
                    }
                  }}
                >
                  🔗 Open in YouTube
                </Link>
              </Box>
            </Box>
          );
        } else {
          // Regular link for non-YouTube URLs
          return (
            <Link
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#007AFF',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#0051D5',
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(part, '_blank', 'noopener,noreferrer');
              }}
            >
              {part}
            </Link>
          );
        }
      }
      return part;
    });
  };

  const handleClose = () => {
    data.onClose();
  };

  const handleMinimize = () => {
    // Minimize functionality (could animate to dock)
    console.log('Minimize clicked');
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <Box
      sx={{
        width: isMaximized ? '90vw' : 600,
        height: isMaximized ? '80vh' : 500,
        backgroundColor: '#f6f6f6',
        borderRadius: isMaximized ? 0 : '12px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid #d1d1d1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* macOS Window Chrome */}
      <Box
        sx={{
          height: 44,
          backgroundColor: '#ececec',
          borderBottom: '1px solid #d1d1d1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          borderTopLeftRadius: isMaximized ? 0 : '12px',
          borderTopRightRadius: isMaximized ? 0 : '12px',
        }}
      >
        {/* Traffic Light Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box
            onClick={handleClose}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ff5f57',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                '&::after': {
                  content: '"×"',
                  color: '#bf4943',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }
              }
            }}
          />
          <Box
            onClick={handleMinimize}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ffbd2e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                '&::after': {
                  content: '"−"',
                  color: '#bf9123',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }
              }
            }}
          />
          <Box
            onClick={handleMaximize}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#28ca42',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                '&::after': {
                  content: '"⤢"',
                  color: '#1f9a31',
                  fontSize: '8px',
                  fontWeight: 'bold',
                }
              }
            }}
          />
        </Box>

        {/* Window Title */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: '#333',
            fontSize: '13px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {data.title}
        </Typography>

        {/* Empty space for symmetry */}
        <Box sx={{ width: 60 }} />
      </Box>

      {/* Notes Content Area */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#fefefe',
          p: 3,
          overflow: 'auto',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Notes Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1d1d1f',
              mb: 1,
              fontSize: '24px',
            }}
          >
            {data.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#86868b',
              fontSize: '13px',
            }}
          >
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>

        {/* Notes Content */}
        <Box
          sx={{
            lineHeight: 1.6,
            fontSize: '16px',
            color: '#1d1d1f',
            whiteSpace: 'pre-wrap',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            cursor: 'text',
            userSelect: 'text',
            '& *': {
              cursor: 'text',
              userSelect: 'text',
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {parseContentWithLinks(data.content)}
        </Box>
      </Box>

      {/* Notes Footer (like macOS Notes) */}
      <Box
        sx={{
          height: 32,
          backgroundColor: '#f6f6f6',
          borderTop: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomLeftRadius: isMaximized ? 0 : '12px',
          borderBottomRightRadius: isMaximized ? 0 : '12px',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#86868b',
            fontSize: '11px',
          }}
        >
          {data.content.split('\n').length} lines, {data.content.length} characters
        </Typography>
      </Box>
    </Box>
  );
};

export default MacOSNotesApp;
