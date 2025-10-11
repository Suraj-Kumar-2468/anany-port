import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { 
  Folder as FolderIcon, 
  Info as InfoIcon,
  Launch as LaunchIcon,
  Language as WebIcon
} from '@mui/icons-material';

interface ProjectNodeProps {
  data: {
    id: string;
    name: string;
    type: string;
    description: string;
    thumbnail: string;
    link: string;
    tags: string[];
    stats: any;
    onInfoClick: () => void;
    onLinkClick: () => void;
  };
}

const ProjectNode: React.FC<ProjectNodeProps> = ({ data }) => {
  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      
      {/* Project Thumbnail */}
      <Box
        sx={{
          height: 120,
          backgroundImage: `url(${data.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FolderIcon 
          sx={{ 
            fontSize: 60, 
            color: 'rgba(255,255,255,0.9)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }} 
        />
        
        {/* Action Buttons */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              data.onInfoClick();
            }}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              data.onLinkClick();
            }}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Project Info */}
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1rem',
            mb: 0.5,
            color: '#333'
          }}
        >
          {data.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            fontSize: '0.8rem',
            mb: 1,
            fontWeight: 500
          }}
        >
          {data.type}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#888',
            fontSize: '0.75rem',
            mb: 1.5,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {data.description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {data.tags.slice(0, 2).map((tag: string) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                backgroundColor: '#f0f0f0',
                color: '#666'
              }}
            />
          ))}
          {data.tags.length > 2 && (
            <Chip
              label={`+${data.tags.length - 2}`}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                backgroundColor: '#e0e0e0',
                color: '#666'
              }}
            />
          )}
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {Object.entries(data.stats)[0] && `${Object.entries(data.stats)[0][1]} ${Object.entries(data.stats)[0][0]}`}
          </Typography>
          
          <WebIcon sx={{ fontSize: 16, color: '#007AFF' }} />
        </Box>
      </Box>

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </Box>
  );
};

export default ProjectNode;
