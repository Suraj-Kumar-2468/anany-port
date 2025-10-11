import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Box, 
  Typography, 
  IconButton, 
  Card,
  CardContent
} from '@mui/material';
import { 
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';

interface VideoCarouselNodeProps {
  data: {
    videos: {
      fullLength: any[];
      shorts: any[];
    };
    onClose: () => void;
  };
}

const VideoCarouselNode: React.FC<VideoCarouselNodeProps> = ({ data }) => {
  const [currentSection, setCurrentSection] = useState<'fullLength' | 'shorts'>('shorts');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentVideos = data.videos[currentSection] || [];
  const currentVideo = currentVideos[currentIndex];

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % currentVideos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + currentVideos.length) % currentVideos.length);
  };

  const switchSection = (section: 'fullLength' | 'shorts') => {
    setCurrentSection(section);
    setCurrentIndex(0);
  };

  if (!currentVideo) return null;

  return (
    <Box
      sx={{
        width: 600,
        backgroundColor: '#fff',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        border: '2px solid #007AFF'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#007AFF', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlayIcon />
          YouTube Videos
        </Typography>
        <IconButton onClick={data.onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Section Tabs */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
        <Box
          onClick={() => switchSection('shorts')}
          sx={{
            flex: 1,
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: currentSection === 'shorts' ? '#f0f8ff' : 'transparent',
            borderBottom: currentSection === 'shorts' ? '2px solid #007AFF' : 'none',
            '&:hover': { backgroundColor: '#f0f8ff' }
          }}
        >
          <Typography variant="body1" fontWeight={currentSection === 'shorts' ? 600 : 400}>
            Shorts ({data.videos.shorts?.length || 0})
          </Typography>
        </Box>
        <Box
          onClick={() => switchSection('fullLength')}
          sx={{
            flex: 1,
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: currentSection === 'fullLength' ? '#f0f8ff' : 'transparent',
            borderBottom: currentSection === 'fullLength' ? '2px solid #007AFF' : 'none',
            '&:hover': { backgroundColor: '#f0f8ff' }
          }}
        >
          <Typography variant="body1" fontWeight={currentSection === 'fullLength' ? 600 : 400}>
            Full Videos ({data.videos.fullLength?.length || 0})
          </Typography>
        </Box>
      </Box>

      {/* Video Player */}
      <Box sx={{ position: 'relative', p: 2 }}>
        <Box
          sx={{
            width: '100%',
            height: currentSection === 'shorts' ? 400 : 300,
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#000',
            position: 'relative'
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentVideo.embedId}`}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
          
          {/* Navigation Arrows */}
          {currentVideos.length > 1 && (
            <>
              <IconButton
                onClick={prevVideo}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              
              <IconButton
                onClick={nextVideo}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* Video Info */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentVideo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentVideo.description}
          </Typography>
          
          {/* Video Counter */}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Video {currentIndex + 1} of {currentVideos.length}
          </Typography>
        </Box>

        {/* Thumbnails */}
        {currentVideos.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mt: 2, pb: 1 }}>
            {currentVideos.map((video: any, index: number) => (
              <Box
                key={video.id}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  minWidth: 100,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: index === currentIndex ? '2px solid #007AFF' : '2px solid transparent',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </Box>
  );
};

export default VideoCarouselNode;
