import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Box, 
  Typography, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MacOSIcon from '../MacOSIcon';

interface MacOSFileExplorerNodeProps {
  data: {
    title: string;
    folders: Array<{
      id: string;
      name: string;
      type: 'folder' | 'video' | 'document' | 'work';
      items?: Array<{
        id: string;
        name: string;
        url?: string;
        type: 'video' | 'document' | 'project';
        notesContent?: string;
      }>;
    }>;
    onClose: () => void;
    onOpenNotes?: (title: string, content: string, type: 'about' | 'project' | 'experience') => void;
  };
}

const MacOSFileExplorerNode: React.FC<MacOSFileExplorerNodeProps> = ({ data }) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const getIcon = (type: string, size: number = 48) => {
    switch (type) {
      case 'folder': return <MacOSIcon name="folder" size={size} />;
      case 'video': return <MacOSIcon name="video" size={size} />;
      case 'document': return <MacOSIcon name="document" size={size} />;
      case 'work': return <MacOSIcon name="work" size={size} />;
      case 'youtube': return <MacOSIcon name="youtube" size={size} />;
      case 'shorts': return <MacOSIcon name="shorts" size={size} />;
      default: return <MacOSIcon name="folder" size={size} />;
    }
  };

  const handleFolderClick = (folderId: string) => {
    if (expandedFolders.has(folderId)) {
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        newSet.delete(folderId);
        return newSet;
      });
    } else {
      setExpandedFolders(prev => new Set(prev).add(folderId));
    }
    setSelectedFolder(folderId);
  };

  const handleItemClick = (item: any) => {
    if (item.notesContent && data.onOpenNotes) {
      // Open in Notes app
      data.onOpenNotes(item.name, item.notesContent, 'project');
    } else if (item.url) {
      // Open external link
      window.open(item.url, '_blank');
    }
  };

  const selectedFolderData = data.folders?.find(f => f.id === selectedFolder);

  return (
    <Box
      sx={{
        width: 650,
        height: 400,
        backgroundColor: '#f6f6f6',
        borderRadius: '12px',
        border: '1px solid #d1d1d1',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      {/* macOS Window Header */}
      <Box sx={{ 
        height: 40,
        backgroundColor: '#e8e8e8',
        borderBottom: '1px solid #d1d1d1',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Traffic Light Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ 
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
            }} onClick={data.onClose} />
            <Box sx={{ 
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
            }} />
            <Box sx={{ 
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
            }} />
          </Box>
          <Typography variant="body2" sx={{ ml: 2, fontWeight: 500, color: '#333', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {data.title}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', height: 'calc(100% - 40px)' }}>
        {/* Sidebar */}
        <Box sx={{ 
          width: 180,
          backgroundColor: '#f1f1f1',
          borderRight: '1px solid #d1d1d1',
          p: 1
        }}>
          <Typography variant="caption" sx={{ 
            color: '#666', 
            textTransform: 'uppercase',
            fontWeight: 600,
            px: 1,
            mb: 1,
            display: 'block'
          }}>
            Favorites
          </Typography>
          <List dense sx={{ py: 0 }}>
            {data.folders?.map((folder) => (
              <ListItem
                key={folder.id}
                component="div"
                onClick={() => handleFolderClick(folder.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: selectedFolder === folder.id ? '#007AFF' : 'transparent',
                  color: selectedFolder === folder.id ? 'white' : '#333',
                  '&:hover': {
                    backgroundColor: selectedFolder === folder.id ? '#007AFF' : '#e0e0e0'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {getIcon(folder.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={folder.name}
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem',
                    fontWeight: selectedFolder === folder.id ? 600 : 400
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ 
          flex: 1,
          p: 3,
          backgroundColor: 'white'
        }}>
          {selectedFolderData ? (
            <Box>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: '#333'
              }}>
                {selectedFolderData.name}
              </Typography>
              
              {selectedFolderData?.items && selectedFolderData.items.length > 0 ? (
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 3
                }}>
                  {selectedFolderData.items?.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        cursor: item.url ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: item.url ? '#f0f0f0' : 'transparent',
                          transform: item.url ? 'translateY(-2px)' : 'none'
                        }
                      }}
                    >
                      {getIcon(item.type)}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 1,
                          textAlign: 'center',
                          color: '#333',
                          fontWeight: 500,
                          lineHeight: 1.2
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                  This folder is empty
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666'
            }}>
              <MacOSIcon name="folder" size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Select a folder
              </Typography>
              <Typography variant="body2">
                Choose a folder from the sidebar to view its contents
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default MacOSFileExplorerNode;
