import React, { useCallback, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  ConnectionLineType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FolderNode from './nodes/FolderNode';
import InfoNode from './nodes/InfoNode';
import ProjectNode from './nodes/ProjectNode';
import VideoCarouselNode from './nodes/VideoCarouselNode';
import ExpandedInfoNode from './nodes/ExpandedInfoNode';
import AboutMeExpandedNode from './nodes/AboutMeExpandedNode';
import { DetailData } from '../App';

interface RightSectionProps {
  selectedSection: string;
  portfolioData: any;
  onInfoClick: (data: DetailData) => void;
  detailData: DetailData | null;
  onSectionChange?: (sectionId: string) => void;
}

const nodeTypes = {
  folder: FolderNode,
  info: InfoNode,
  project: ProjectNode,
  videoCarousel: VideoCarouselNode,
  expandedInfo: ExpandedInfoNode,
  aboutMeExpanded: AboutMeExpandedNode,
};

const RightSection: React.FC<RightSectionProps> = ({
  selectedSection,
  portfolioData,
  onInfoClick,
  detailData,
  onSectionChange
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  // Generate nodes based on selected section
  const generateNodes = useCallback(() => {
    const nodes: Node[] = [];
    
    if (selectedSection === 'work') {
      // Welcome message - centered at top
      nodes.push({
        id: 'welcome',
        type: 'info',
        position: { x: 400, y: 100 },
        data: {
          label: 'welcome to my',
          subtitle: 'portfolio.',
          type: 'welcome'
        },
      });

      // Videos folder - conditional rendering with proper spacing
      if (expandedNodes.has('videos-folder')) {
        nodes.push({
          id: 'videos-expanded',
          type: 'videoCarousel',
          position: { x: 150, y: 300 },
          data: {
            videos: portfolioData.videos,
            onClose: () => {
              setExpandedNodes(prev => {
                const newSet = new Set(prev);
                newSet.delete('videos-folder');
                return newSet;
              });
            }
          },
        });
      } else {
        // Only show main navigation nodes if no expanded nodes
        // About Me navigation
        nodes.push({
          id: 'about-nav',
          type: 'info',
          position: { x: 200, y: 300 },
          data: {
            label: 'About Me',
            subtitle: 'Learn more about me',
            type: 'about',
            onClick: () => {
              // Navigate to about section
              if (onSectionChange) {
                onSectionChange('about');
              }
            }
          },
        });

        // YouTube Videos folder
        nodes.push({
          id: 'videos-folder',
          type: 'folder',
          position: { x: 450, y: 300 },
          data: {
            label: 'YouTube Videos',
            onClick: () => {
              setExpandedNodes(prev => new Set(prev).add('videos-folder'));
            }
          },
        });

        // Resume navigation with download
        nodes.push({
          id: 'resume-nav',
          type: 'info',
          position: { x: 700, y: 300 },
          data: {
            label: 'Resume.pdf',
            subtitle: 'Download my resume',
            type: 'resume',
            onClick: () => {
              // Create download link
              const link = document.createElement('a');
              link.href = '/resume.pdf'; // You'll need to add this file to public folder
              link.download = 'Alex_Thompson_Resume.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          },
        });
      }

    } else if (selectedSection === 'about') {
      // About Me - conditional rendering
      if (expandedNodes.has('about-main')) {
        nodes.push({
          id: 'about-expanded',
          type: 'aboutMeExpanded',
          position: { x: 100, y: 80 },
          data: {
            profile: portfolioData.profile,
            content: portfolioData.sections.about.content,
            onClose: () => {
              setExpandedNodes(prev => {
                const newSet = new Set(prev);
                newSet.delete('about-main');
                return newSet;
              });
            }
          },
        });
      } else {
        nodes.push({
          id: 'about-main',
          type: 'info',
          position: { x: 350, y: 80 },
          data: {
            label: 'About Me',
            subtitle: portfolioData.profile.bio.substring(0, 80) + '...',
            type: 'about',
            onClick: () => {
              setExpandedNodes(prev => new Set(prev).add('about-main'));
            }
          },
        });
      }

      // Only show Skills and Achievements folders if About Me is not expanded
      if (!expandedNodes.has('about-main')) {
        // Skills folder - conditional rendering
        if (expandedNodes.has('skills-folder')) {
          nodes.push({
            id: 'skills-expanded',
            type: 'expandedInfo',
            position: { x: 100, y: 300 },
            data: {
              title: 'Skills & Expertise',
              content: { skills: portfolioData.sections.about.content.skills },
              type: 'skills',
              onClose: () => {
                setExpandedNodes(prev => {
                  const newSet = new Set(prev);
                  newSet.delete('skills-folder');
                  return newSet;
                });
              }
            },
          });
        } else {
          nodes.push({
            id: 'skills-folder',
            type: 'folder',
            position: { x: 200, y: 300 },
            data: {
              label: 'Skills',
              onClick: () => {
                setExpandedNodes(prev => new Set(prev).add('skills-folder'));
              }
            },
          });
        }

        // Achievements folder - conditional rendering
        if (expandedNodes.has('achievements-folder')) {
          nodes.push({
            id: 'achievements-expanded',
            type: 'expandedInfo',
            position: { x: 450, y: 300 },
            data: {
              title: 'Achievements',
              content: { achievements: portfolioData.sections.about.content.achievements },
              type: 'achievements',
              onClose: () => {
                setExpandedNodes(prev => {
                  const newSet = new Set(prev);
                  newSet.delete('achievements-folder');
                  return newSet;
                });
              }
            },
          });
        } else {
          nodes.push({
            id: 'achievements-folder',
            type: 'folder',
            position: { x: 600, y: 300 },
            data: {
              label: 'Achievements',
              onClick: () => {
                setExpandedNodes(prev => new Set(prev).add('achievements-folder'));
              }
            },
          });
        }
      }

    } else if (selectedSection === 'resume') {
      // Resume section layout - centered and organized
      nodes.push({
        id: 'resume-main',
        type: 'info',
        position: { x: 350, y: 100 },
        data: {
          label: 'Resume.pdf',
          subtitle: 'Download my complete resume',
          type: 'resume',
          onClick: () => onInfoClick({
            title: 'Resume',
            content: portfolioData.sections.resume.content,
            type: 'resume'
          })
        },
      });

      // Experience folder - conditional rendering
      if (expandedNodes.has('experience-folder')) {
        nodes.push({
          id: 'experience-expanded',
          type: 'expandedInfo',
          position: { x: 100, y: 280 },
          data: {
            title: 'Work Experience',
            content: { experience: portfolioData.sections.resume.content.experience },
            type: 'experience',
            onClose: () => {
              setExpandedNodes(prev => {
                const newSet = new Set(prev);
                newSet.delete('experience-folder');
                return newSet;
              });
            }
          },
        });
      } else {
        nodes.push({
          id: 'experience-folder',
          type: 'folder',
          position: { x: 250, y: 280 },
          data: {
            label: 'Experience',
            onClick: () => {
              setExpandedNodes(prev => new Set(prev).add('experience-folder'));
            }
          },
        });
      }

      // Education folder - conditional rendering
      if (expandedNodes.has('education-folder')) {
        nodes.push({
          id: 'education-expanded',
          type: 'expandedInfo',
          position: { x: 450, y: 280 },
          data: {
            title: 'Education',
            content: { education: portfolioData.sections.resume.content.education },
            type: 'education',
            onClose: () => {
              setExpandedNodes(prev => {
                const newSet = new Set(prev);
                newSet.delete('education-folder');
                return newSet;
              });
            }
          },
        });
      } else {
        nodes.push({
          id: 'education-folder',
          type: 'folder',
          position: { x: 550, y: 280 },
          data: {
            label: 'Education',
            onClick: () => {
              setExpandedNodes(prev => new Set(prev).add('education-folder'));
            }
          },
        });
      }
    }

    return nodes;
  }, [selectedSection, portfolioData, onInfoClick, expandedNodes, onSectionChange]);

  const generateEdges = useCallback(() => {
    const edges: Edge[] = [];
    // Add connections between related nodes if needed
    return edges;
  }, []);

  const initialNodes = useMemo(() => generateNodes(), [generateNodes]);
  const initialEdges = useMemo(() => generateEdges(), [generateEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Clear expanded nodes when section changes
  React.useEffect(() => {
    setExpandedNodes(new Set());
  }, [selectedSection]);

  // Update nodes when section or expanded nodes change
  React.useEffect(() => {
    setNodes(generateNodes());
    setEdges(generateEdges());
  }, [selectedSection, expandedNodes, generateNodes, generateEdges, setNodes, setEdges]);

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa'
      }}>
        <Typography variant="h6" fontWeight="bold">
          {selectedSection === 'work' && 'Work Portfolio'}
          {selectedSection === 'about' && 'About Me'}
          {selectedSection === 'resume' && 'Resume & Experience'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedSection === 'work' && 'Visual Design & UI'}
          {selectedSection === 'about' && 'Personal Information & Skills'}
          {selectedSection === 'resume' && 'Professional Background'}
        </Typography>
      </Box>

      {/* React Flow Canvas */}
      <Box sx={{ 
        height: 'calc(100% - 80px)',
        width: '100%',
        position: 'relative'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.8}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background 
            color="#999999" 
            gap={20} 
            variant={BackgroundVariant.Dots}
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default RightSection;
