import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Paper
} from '@mui/material';
import {
  Work as WorkIcon,
  Info as InfoIcon,
  Description as ResumeIcon,
  StickyNote2 as TodoIcon
} from '@mui/icons-material';
import { DetailData } from '../App';

interface LeftSidebarProps {
  portfolioData: any;
  selectedSection: string;
  onSectionClick: (sectionId: string) => void;
  onInfoClick: (data: DetailData) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  portfolioData,
  selectedSection,
  onSectionClick,
  onInfoClick
}) => {
  const { profile, sections, todoList } = portfolioData;

  const menuItems = [
    { id: 'work', label: 'Work', icon: <WorkIcon /> },
    { id: 'about', label: 'About Me', icon: <InfoIcon /> },
    { id: 'resume', label: 'Resume', icon: <ResumeIcon /> }
  ];

  const handleInfoClick = (sectionId: string) => {
    const section = sections[sectionId];
    onInfoClick({
      title: section.title,
      content: section.content || section,
      type: sectionId as 'info' | 'project' | 'resume'
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Profile Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          src={profile.avatar}
          sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2,
            border: '3px solid #007AFF'
          }}
        />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {profile.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          @{profile.name.toLowerCase().replace(' ', '')} • {profile.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Less than 1 Year Experience includes:
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedSection === item.id}
                onClick={() => onSectionClick(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#007AFF',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#0056CC',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mx: 2 }} />

        {/* Todo Section */}
        <Box sx={{ p: 2 }}>
          <Paper 
            elevation={0}
            sx={{ 
              backgroundColor: '#FFF3CD',
              p: 2,
              borderRadius: 2,
              border: '1px solid #FFEAA7'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#FF6B6B',
                mr: 1 
              }} />
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#FFD93D',
                mr: 1 
              }} />
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: '#6BCF7F',
                mr: 1 
              }} />
              <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
                To do:
              </Typography>
            </Box>
            
            <List dense sx={{ py: 0 }}>
              {todoList.slice(0, 6).map((todo: string, index: number) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {todo}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <ListItemButton
          onClick={() => handleInfoClick('about')}
          sx={{ borderRadius: 1, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Profile"
            primaryTypographyProps={{ fontSize: '0.85rem' }}
          />
        </ListItemButton>
        
        <ListItemButton
          sx={{ borderRadius: 1, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              backgroundColor: '#4CAF50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" color="white" fontSize="0.7rem">
                ●
              </Typography>
            </Box>
          </ListItemIcon>
          <ListItemText 
            primary="Portfolio"
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 'bold' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default LeftSidebar;
