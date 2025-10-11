import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Box, 
  Typography, 
  IconButton,
  Chip
} from '@mui/material';
import { 
  Close as CloseIcon,
  Star as StarIcon,
  Code as CodeIcon,
  Work as WorkIcon,
  School as SchoolIcon
} from '@mui/icons-material';

interface ExpandedInfoNodeProps {
  data: {
    title: string;
    content: any;
    type: string;
    onClose: () => void;
  };
}

const ExpandedInfoNode: React.FC<ExpandedInfoNodeProps> = ({ data }) => {
  const renderContent = () => {
    if (data.content.skills) {
      return (
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              fontWeight: 600,
              color: '#007AFF',
              mb: 3
            }}
          >
            <CodeIcon sx={{ fontSize: '1.8rem' }} />
            Skills & Expertise
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {data.content.skills.map((skill: string, index: number) => (
              <Chip 
                key={index} 
                label={skill} 
                sx={{
                  backgroundColor: '#007AFF',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  height: '36px',
                  '&:hover': {
                    backgroundColor: '#0056CC',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,122,255,0.3)'
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      );
    }

    if (data.content.achievements) {
      return (
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              fontWeight: 600,
              color: '#007AFF',
              mb: 3
            }}
          >
            <StarIcon sx={{ fontSize: '1.8rem' }} />
            Key Achievements
          </Typography>
          <Box sx={{ mt: 2 }}>
            {data.content.achievements.map((achievement: string, index: number) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 2, 
                  mb: 2.5,
                  p: 2,
                  backgroundColor: '#f8f9ff',
                  borderRadius: 2,
                  border: '1px solid #e3e8ff'
                }}
              >
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: '#007AFF',
                  mt: 1,
                  flexShrink: 0
                }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#444', 
                    lineHeight: 1.7,
                    fontSize: '1rem'
                  }}
                >
                  {achievement}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (data.content.experience) {
      return (
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              fontWeight: 600,
              color: '#007AFF',
              mb: 3
            }}
          >
            <WorkIcon sx={{ fontSize: '1.8rem' }} />
            Work Experience
          </Typography>
          <Box sx={{ mt: 2 }}>
            {data.content.experience.map((exp: any, index: number) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3,
                  p: 3,
                  backgroundColor: '#f8f9ff',
                  borderRadius: 3,
                  border: '1px solid #e3e8ff'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                  {exp.position}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#007AFF', mb: 1 }}>
                  {exp.company}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  {exp.duration}
                </Typography>
                <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (data.content.education) {
      return (
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              fontWeight: 600,
              color: '#007AFF',
              mb: 3
            }}
          >
            <SchoolIcon sx={{ fontSize: '1.8rem' }} />
            Education
          </Typography>
          <Box sx={{ mt: 2 }}>
            {data.content.education.map((edu: any, index: number) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3,
                  p: 3,
                  backgroundColor: '#f8f9ff',
                  borderRadius: 3,
                  border: '1px solid #e3e8ff'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                  {edu.degree}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#007AFF', mb: 1 }}>
                  {edu.institution}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  {edu.year}
                </Typography>
                {edu.description && (
                  <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    return (
      <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
        No content available
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        width: 400,
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
        <Typography variant="h6">
          {data.title}
        </Typography>
        <IconButton onClick={data.onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {renderContent()}
      </Box>

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </Box>
  );
};

export default ExpandedInfoNode;
