import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography } from '@mui/material';
import MacOSIcon from '../MacOSIcon';

interface DesktopFolderNodeProps {
  data: {
    label: string;
    type: 'folder' | 'video' | 'shorts' | 'document';
    onClick?: () => void;
  };
}

const DesktopFolderNode: React.FC<DesktopFolderNodeProps> = ({ data }) => {
  const getIconName = () => {
    switch (data.type) {
      case 'video':
        return 'youtube';
      case 'shorts':
        return 'shorts';
      case 'document':
        return 'document';
      default:
        return 'folder';
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': {
            '& .icon-label': {
              backgroundColor: 'rgba(0, 122, 255, 0.8)',
              color: 'white',
            }
          }
        }}
        onClick={data.onClick}
      >
        <MacOSIcon name={getIconName()} size={64} />
        <Typography
          className="icon-label"
          variant="caption"
          sx={{
            mt: 0.5,
            fontSize: '11px',
            color: '#000',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '2px 6px',
            borderRadius: '4px',
            textAlign: 'center',
            maxWidth: '80px',
            wordWrap: 'break-word',
            lineHeight: 1.2,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.2s ease',
          }}
        >
          {data.label}
        </Typography>
      </Box>
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </>
  );
};

export default DesktopFolderNode;
