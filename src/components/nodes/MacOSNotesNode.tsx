import React from 'react';
import { Handle, Position } from 'reactflow';
import MacOSNotesApp from './MacOSNotesApp';

interface MacOSNotesNodeProps {
  data: {
    title: string;
    content: string;
    type: 'about' | 'project' | 'experience';
    onClose: () => void;
  };
}

const MacOSNotesNode: React.FC<MacOSNotesNodeProps> = ({ data }) => {
  return (
    <div 
      style={{ 
        pointerEvents: 'all',
        cursor: 'default'
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <MacOSNotesApp data={data} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
};

export default MacOSNotesNode;
