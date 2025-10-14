import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import {
  ReactFlow,
  ReactFlowProvider,
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
import InfoNode from './nodes/InfoNode';
import ExpandedInfoNode from './nodes/ExpandedInfoNode';
import AboutMeExpandedNode from './nodes/AboutMeExpandedNode';
import MacOSFileExplorerNode from './nodes/MacOSFileExplorerNode';
import MacOSNotesNode from './nodes/MacOSNotesNode';
import DesktopFolderNode from './nodes/DesktopFolderNode';
import MacOSDock from './MacOSDock';
import { DetailData } from '../App';

interface RightSectionProps {
  selectedSection: string;
  portfolioData: any;
  onInfoClick: (data: DetailData) => void;
  detailData: DetailData | null;
  onSectionChange?: (sectionId: string) => void;
}

const nodeTypes = {
  info: InfoNode,
  expandedInfo: ExpandedInfoNode,
  aboutMeExpanded: AboutMeExpandedNode,
  macOSFileExplorer: MacOSFileExplorerNode,
  macOSNotes: MacOSNotesNode,
  desktopFolder: DesktopFolderNode,
};

const RightSection: React.FC<RightSectionProps> = ({
  selectedSection,
  portfolioData,
  onInfoClick,
  detailData,
  onSectionChange
}) => {
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notesContent, setNotesContent] = useState<{
    title: string;
    content: string;
    type: 'about' | 'project' | 'experience';
  } | null>(null);
  
  // Handle dock item clicks
  const handleDockItemClick = (itemId: string) => {
    if (itemId === 'finder' || itemId === 'youtube-videos' || itemId === 'youtube-shorts') {
      setShowFileExplorer(true);
    } else if (itemId === 'about') {
      // Show About Me in Notes app
      setNotesContent({
        title: 'About Me',
        content: portfolioData.profile.detailedAbout,
        type: 'about'
      });
      setShowNotes(true);
    } else if (onSectionChange) {
      onSectionChange(itemId);
    }
  };

  // Generate nodes based on selected section
  const generateNodes = useCallback(() => {
    const nodes: Node[] = [];
    
    // Desktop folder nodes arranged - half left, half right
    const projects = portfolioData.sections.work.projects;
    
    // Desktop icons positioned on both sides
    const desktopIcons = [
      // Left side icons
      { 
        id: 'resume-desktop', 
        label: 'Resume', 
        type: 'resume', 
        position: { x: 50, y: 100 },
        onClick: () => window.open('/resume.pdf', '_blank')
      },
      { 
        id: 'notes-desktop', 
        label: 'Notes', 
        type: 'notes', 
        position: { x: 50, y: 200 },
        onClick: () => {
          setNotesContent({
            title: 'About Me',
            content: `${portfolioData.profile.detailedAbout}\n\n🎬 Sample YouTube Video:\nhttps://youtube.com/watch?v=dQw4w9WgXcQ`,
            type: 'about'
          });
          setShowNotes(true);
        }
      },
      { 
        id: 'youtube-videos-desktop', 
        label: 'YouTube Videos', 
        type: 'video', 
        position: { x: 50, y: 300 },
        onClick: () => {
          setNotesContent({
            title: 'YouTube Videos',
            content: `📺 My YouTube Channel\n\nCheck out my latest videos:\n\n🎬 Tech Review:\nhttps://youtube.com/watch?v=dQw4w9WgXcQ\n\n🎬 Tutorial Series:\nhttps://youtube.com/watch?v=oHg5SJYRHA0`,
            type: 'project'
          });
          setShowNotes(true);
        }
      },
      // Right side icons
      { 
        id: 'youtube-shorts-desktop', 
        label: 'YouTube Shorts', 
        type: 'shorts', 
        position: { x: window.innerWidth - 150, y: 100 },
        onClick: () => {
          setNotesContent({
            title: 'YouTube Shorts',
            content: `🩳 My YouTube Shorts\n\nQuick videos and tutorials:\n\n🎬 Quick Tip:\nhttps://youtube.com/watch?v=dQw4w9WgXcQ\n\n🎬 Behind the Scenes:\nhttps://youtube.com/watch?v=oHg5SJYRHA0`,
            type: 'project'
          });
          setShowNotes(true);
        }
      },
    ];

    // Add project folders - half on left, half on right
    projects.slice(0, 4).forEach((project: any, index: number) => {
      const isLeftSide = index < 2;
      const sideIndex = index % 2;
      
      desktopIcons.push({
        id: `desktop-project-${project.id}`,
        label: project.name,
        type: 'folder',
        position: { 
          x: isLeftSide ? 50 : window.innerWidth - 150, 
          y: 400 + (sideIndex * 100) 
        },
        onClick: () => {
          setNotesContent({
            title: project.name,
            content: `📁 ${project.name}\n\n📋 Project Type: ${project.type}\n\n📝 Description:\n${project.description}\n\n🏷️ Tags:\n${project.tags?.join(', ') || 'N/A'}\n\n📊 Statistics:\n${Object.entries(project.stats || {}).map(([key, value]) => `• ${key}: ${value}`).join('\n')}\n\n🔗 Project Link: ${project.link}\n\n🎬 Demo Video:\nhttps://youtube.com/watch?v=dQw4w9WgXcQ`,
            type: 'project'
          });
          setShowNotes(true);
        }
      });
    });

    // Add all desktop icons as nodes
    desktopIcons.forEach((icon) => {
      nodes.push({
        id: icon.id,
        type: 'desktopFolder',
        position: icon.position,
        data: {
          label: icon.label,
          type: icon.type,
          onClick: icon.onClick
        },
      });
    });

    // Show macOS File Explorer if toggled
    if (showFileExplorer) {
      const fileExplorerData = {
        title: 'Portfolio Explorer',
        folders: [
          {
            id: 'work',
            name: 'Work Projects',
            type: 'work',
            items: portfolioData.sections.work.projects.map((project: any) => ({
              id: project.id,
              name: project.name,
              type: 'project',
              url: project.link,
              notesContent: `📁 ${project.name}\n\n📋 Project Type: ${project.type}\n\n📝 Description:\n${project.description}\n\n🏷️ Tags:\n${project.tags?.join(', ') || 'N/A'}\n\n📊 Statistics:\n${Object.entries(project.stats || {}).map(([key, value]) => `• ${key}: ${value}`).join('\n')}\n\n🔗 Link: ${project.link}`
            }))
          },
          {
            id: 'youtube-videos',
            name: 'YouTube Videos',
            type: 'youtube',
            items: portfolioData.videos.fullLength.map((video: any) => ({
              id: video.id,
              name: video.title,
              type: 'video',
              url: video.url
            }))
          },
          {
            id: 'youtube-shorts',
            name: 'YouTube Shorts',
            type: 'shorts',
            items: portfolioData.videos.shorts.map((video: any) => ({
              id: video.id,
              name: video.title,
              type: 'video',
              url: video.url
            }))
          },
          {
            id: 'resume',
            name: 'Resume & Documents',
            type: 'document',
            items: [
              {
                id: 'resume-pdf',
                name: 'Resume.pdf',
                type: 'document',
                url: '/resume.pdf'
              }
            ]
          }
        ],
        onClose: () => setShowFileExplorer(false),
        onOpenNotes: (title: string, content: string, type: 'about' | 'project' | 'experience') => {
          setNotesContent({ title, content, type });
          setShowNotes(true);
        }
      };

      nodes.push({
        id: 'file-explorer',
        type: 'macOSFileExplorer',
        position: { x: 340, y: 170 }, // Position like in screenshot
        data: fileExplorerData,
      });
    }

    // Show macOS Notes if toggled
    if (showNotes && notesContent) {
      nodes.push({
        id: 'notes-app',
        type: 'macOSNotes',
        position: { x: 300, y: 100 },
        draggable: false,
        selectable: false,
        data: {
          ...notesContent,
          onClose: () => setShowNotes(false)
        },
      });
    }

    return nodes;
  }, [portfolioData, showFileExplorer, showNotes, notesContent]);

  const generateEdges = useCallback(() => {
    const edges: Edge[] = [];
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

  // Update nodes when file explorer state changes
  React.useEffect(() => {
    setNodes(generateNodes());
    setEdges(generateEdges());
  }, [showFileExplorer, generateNodes, generateEdges, setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <Box sx={{ height: '100%', position: 'relative', pt: '24px' }}>
        {/* Background Text */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: '#34C759',
                fontSize: '14px',
                fontWeight: 500,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#34C759',
                }}
              />
              ACTIVELY LOOKING FOR OPPORTUNITIES
            </Box>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <span style={{ 
              color: '#6366f1', 
              fontSize: '48px', 
              fontWeight: 400,
              fontFamily: 'cursive'
            }}>
              Hey there. I am
            </span>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <span style={{ 
              color: '#1f2937', 
              fontSize: '72px', 
              fontWeight: 700,
              fontFamily: 'serif',
              lineHeight: 0.9
            }}>
              Anany<br />Deep
            </span>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: '#6b7280',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 1,
                  backgroundColor: '#6b7280',
                }}
              />
              VIDEO EDITOR
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                }}
              />
            </Box>
          </Box>
          
          <Box
            sx={{
              display: 'inline-block',
              backgroundColor: '#6366f1',
              color: 'white',
              px: 4,
              py: 2,
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
              '&:hover': {
                backgroundColor: '#4f46e5',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                fontWeight: 700,
              }
            }}
            onClick={() => {
              // Add contact functionality here
              console.log('Get in Touch clicked');
            }}
          >
            Get in Touch
          </Box>
        </Box>

        {/* React Flow Canvas */}
        <Box sx={{ height: 'calc(100% - 24px)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.5}
            maxZoom={2}
            fitView={false}
          >
            <Background 
              variant={BackgroundVariant.Lines} 
              gap={20} 
              size={1}
              color="rgba(0,0,0,0.05)"
            />
          </ReactFlow>
        </Box>

        {/* macOS Dock */}
        <MacOSDock onItemClick={handleDockItemClick} />
      </Box>
    </ReactFlowProvider>
  );
};

export default RightSection;
