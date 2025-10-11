import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Box, 
  Typography, 
  IconButton,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Code as CodeIcon,
  School as SchoolIcon
} from '@mui/icons-material';

interface AboutMeExpandedNodeProps {
  data: {
    profile: any;
    content: any;
    onClose: () => void;
  };
}

const AboutMeExpandedNode: React.FC<AboutMeExpandedNodeProps> = ({ data }) => {
  const { profile, content } = data;

  return (
    <Box
      sx={{
        width: 700,
        backgroundColor: '#fff',
        borderRadius: 4,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        border: '3px solid #007AFF'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
        color: 'white',
        p: 3,
        position: 'relative'
      }}>
        <IconButton 
          onClick={data.onClose} 
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.2)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{ 
              width: 80, 
              height: 80,
              border: '3px solid rgba(255,255,255,0.3)',
              fontSize: '2rem'
            }}
          >
            {profile.name.charAt(0)}
          </Avatar>
          
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {profile.name}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
              {profile.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
              <LocationIcon fontSize="small" />
              <Typography variant="body1">{profile.location}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Bio Section */}
        <Card sx={{ mb: 3, backgroundColor: '#f8f9ff', border: '1px solid #e3e8ff' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#007AFF' }}>
              <PersonIcon />
              About Me
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#444' }}>
              {profile.bio}
            </Typography>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card sx={{ mb: 3, backgroundColor: '#f0f8ff', border: '1px solid #d0e7ff' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#007AFF' }}>
              <CodeIcon />
              Skills & Expertise
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
              {content.skills?.map((skill: string, index: number) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  sx={{
                    backgroundColor: '#007AFF',
                    color: 'white',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#0056CC',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,122,255,0.3)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Experience & Education Grid */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          {/* Experience */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%', backgroundColor: '#fff8f0', border: '1px solid #ffe7d0' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FF8C00' }}>
                  <WorkIcon />
                  Experience
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profile.experience}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label="Video Editing" 
                    size="small" 
                    sx={{ backgroundColor: '#FF8C00', color: 'white' }}
                  />
                  <Chip 
                    label="Creative Storytelling" 
                    size="small" 
                    sx={{ backgroundColor: '#FF8C00', color: 'white' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Education */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%', backgroundColor: '#f0fff8', border: '1px solid #d0ffe7' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#00C851' }}>
                  <SchoolIcon />
                  Education
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Currently pursuing graduate studies while building professional experience
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label="Graduate Student" 
                    size="small" 
                    sx={{ backgroundColor: '#00C851', color: 'white' }}
                  />
                  <Chip 
                    label="Los Angeles, CA" 
                    size="small" 
                    sx={{ backgroundColor: '#00C851', color: 'white' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Achievements */}
        {content.achievements && (
          <Card sx={{ mt: 3, backgroundColor: '#fff0f8', border: '1px solid #ffd0e7' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#E91E63' }}>
                <StarIcon />
                Key Achievements
              </Typography>
              <Box sx={{ mt: 2 }}>
                {content.achievements.slice(0, 3).map((achievement: string, index: number) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: '#E91E63',
                      mt: 1,
                      flexShrink: 0
                    }} />
                    <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.6 }}>
                      {achievement}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </Box>
  );
};

export default AboutMeExpandedNode;
