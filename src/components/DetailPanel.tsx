import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  Launch as LaunchIcon,
  Download as DownloadIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { DetailData } from '../App';

interface DetailPanelProps {
  data: DetailData;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ data, onClose }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const renderVideoCarousel = (videos: any[], title: string) => {
    if (!videos || videos.length === 0) return null;

    const currentVideo = videos[currentVideoIndex];
    
    const nextVideo = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    const prevVideo = () => {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    };

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlayIcon color="primary" />
          {title} ({videos.length} videos)
        </Typography>
        
        {/* Main Video Player */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Box
            sx={{
              width: '100%',
              height: title.includes('Shorts') ? 400 : 250,
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: '#000'
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
          </Box>
          
          {/* Navigation Arrows */}
          {videos.length > 1 && (
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
        <Typography variant="h6" gutterBottom>
          {currentVideo.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {currentVideo.description}
        </Typography>

        {/* Video Thumbnails */}
        {videos.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {videos.map((video: any, index: number) => (
              <Box
                key={video.id}
                onClick={() => setCurrentVideoIndex(index)}
                sx={{
                  minWidth: 120,
                  height: 80,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: index === currentVideoIndex ? '2px solid #007AFF' : '2px solid transparent',
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

        {/* Video Counter */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Video {currentVideoIndex + 1} of {videos.length}
        </Typography>
      </Box>
    );
  };

  const renderContent = () => {
    if (data.type === 'videos') {
      const videos = data.content;
      return (
        <Box>
          {videos.fullLength && videos.fullLength.length > 0 && 
            renderVideoCarousel(videos.fullLength, 'Full Length Videos')}
          
          {videos.shorts && videos.shorts.length > 0 && 
            renderVideoCarousel(videos.shorts, 'YouTube Shorts')}
        </Box>
      );
    }

    if (data.type === 'project') {
      const project = data.content;
      return (
        <Box>
          {/* Project Image */}
          <Box
            sx={{
              width: '100%',
              height: 200,
              backgroundImage: `url(${project.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              mb: 3,
              position: 'relative'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16
              }}
            >
              <IconButton
                onClick={() => window.open(project.link, '_blank')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                }}
              >
                <LaunchIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Project Details */}
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {project.name}
          </Typography>
          
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {project.type}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {project.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Technologies & Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.tags.map((tag: string) => (
                <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>

          {/* Stats */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Project Statistics
            </Typography>
            <List dense>
              {Object.entries(project.stats).map(([key, value]) => (
                <ListItem key={key} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={key.charAt(0).toUpperCase() + key.slice(1)}
                    secondary={value as string}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      );
    }

    if (data.type === 'resume') {
      const resume = data.content;
      return (
        <Box>
          {/* Download Button */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(resume.downloadUrl, '_blank')}
              sx={{ mb: 2 }}
            >
              Download Resume PDF
            </Button>
            <Typography variant="body2" color="text.secondary">
              Complete professional resume with detailed experience
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Experience Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon color="primary" />
              Work Experience
            </Typography>
            <List>
              {resume.experience.map((exp: any, index: number) => (
                <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {exp.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          {exp.company} • {exp.period}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {exp.description}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Education Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" />
              Education
            </Typography>
            <List>
              {resume.education.map((edu: any, index: number) => (
                <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {edu.degree}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          {edu.school} • {edu.period}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      );
    }

    // Default info content
    const content = data.content;
    return (
      <Box>
        {content.description && (
          <Typography variant="body1" paragraph>
            {content.description}
          </Typography>
        )}

        {content.skills && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills & Expertise
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {content.skills.map((skill: string) => (
                <Chip key={skill} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {content.achievements && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Key Achievements
            </Typography>
            <List>
              {content.achievements.map((achievement: string, index: number) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText primary={achievement} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: 400,
        height: '100%',
        backgroundColor: '#fff',
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          {data.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: 2
      }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DetailPanel;
