import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography } from '@mui/material';
import { 
  Info as InfoIcon, 
  Description as ResumeIcon,
  Person as PersonIcon 
} from '@mui/icons-material';

interface InfoNodeProps {
  data: {
    label: string;
    subtitle?: string;
    type: 'info' | 'resume' | 'about' | 'welcome';
    onClick?: () => void;
  };
}

const InfoNode: React.FC<InfoNodeProps> = ({ data }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'resume':
        return <ResumeIcon sx={{ fontSize: 24, color: '#FF6B6B' }} />;
      case 'about':
        return <PersonIcon sx={{ fontSize: 24, color: '#4ECDC4' }} />;
      case 'welcome':
        return null;
      default:
        return <InfoIcon sx={{ fontSize: 24, color: '#007AFF' }} />;
    }
  };

  if (data.type === 'welcome') {
    return (
      <Box
        sx={{
          minWidth: 400,
          textAlign: 'center',
          backgroundColor: 'transparent',
          p: 3
        }}
      >
        <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 300,
            color: '#666',
            mb: 1,
            fontSize: '2.5rem'
          }}
        >
          {data.label}
        </Typography>
        
        <Typography 
          variant="h1" 
          sx={{ 
            fontWeight: 'bold',
            fontStyle: 'italic',
            color: '#333',
            fontFamily: 'serif',
            fontSize: '4rem'
          }}
        >
          {data.subtitle}
        </Typography>

        <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minWidth: 200,
        backgroundColor: '#fff',
        border: '2px solid #e0e0e0',
        borderRadius: 3,
        p: 3,
        cursor: data.onClick ? 'pointer' : 'default',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        '&:hover': {
          boxShadow: data.onClick ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)',
          transform: data.onClick ? 'translateY(-2px)' : 'none',
          borderColor: '#007AFF'
        },
        transition: 'all 0.3s ease'
      }}
      onClick={data.onClick}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      
      {getIcon()}
      
      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: '#333',
            fontSize: '1.1rem'
          }}
        >
          {data.label}
        </Typography>
        
        {data.subtitle && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.85rem',
              mt: 0.5
            }}
          >
            {data.subtitle}
          </Typography>
        )}
      </Box>

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </Box>
  );
};

export default InfoNode;
