import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';

interface FolderNodeProps {
  data: {
    label: string;
    onClick?: () => void;
  };
}

const FolderNode: React.FC<FolderNodeProps> = ({ data }) => {
  return (
    <Box
      sx={{
        minWidth: 150,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        p: 2,
        borderRadius: 2,
        '&:hover': {
          backgroundColor: 'rgba(0, 122, 255, 0.05)',
          '& .folder-icon': {
            color: '#007AFF',
            transform: 'scale(1.1)'
          },
          '& .folder-label': {
            color: '#007AFF'
          }
        },
        transition: 'all 0.3s ease'
      }}
      onClick={data.onClick}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      
      <FolderIcon 
        className="folder-icon"
        sx={{ 
          fontSize: 80, 
          color: '#4A90E2',
          mb: 1.5,
          transition: 'all 0.3s ease'
        }} 
      />
      
      <Typography 
        className="folder-label"
        variant="body1" 
        sx={{ 
          textAlign: 'center',
          fontWeight: 600,
          color: '#333',
          fontSize: '1rem',
          transition: 'color 0.3s ease'
        }}
      >
        {data.label}
      </Typography>

      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </Box>
  );
};

export default FolderNode;
