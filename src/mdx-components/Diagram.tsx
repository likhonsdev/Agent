import React, { useEffect, useRef } from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import type { DiagramConfig } from '../types';

// Dynamically import mermaid to avoid SSR issues
declare global {
  interface Window {
    mermaid: {
      initialize: (config: any) => void;
      render: (id: string, definition: string, callback: (svgCode: string) => void) => void;
    };
  }
}

interface DiagramProps {
  content: string;
  type?: DiagramConfig['type'];
  title?: string;
}

export const Diagram: React.FC<DiagramProps> = ({ content, type = 'flowchart', title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramId = `diagram-${Math.random().toString(36).substring(2, 9)}`;
  
  useEffect(() => {
    // Dynamically load mermaid if needed
    const loadMermaid = async () => {
      if (!window.mermaid) {
        const mermaid = await import('mermaid');
        window.mermaid = mermaid.default;
        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'neutral',
        });
      }
      
      try {
        // Prepend diagram type if not included in content
        let diagramContent = content;
        if (!content.trim().startsWith(type)) {
          diagramContent = `${type}\n${content}`;
        }
        
        // Render diagram
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          window.mermaid.render(diagramId, diagramContent, (svgCode) => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svgCode;
            }
          });
        }
      } catch (error) {
        console.error('Error rendering diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 4px;">
            <p><strong>Error rendering diagram:</strong></p>
            <p>${(error as Error).message || 'Unknown error'}</p>
            <pre>${content}</pre>
          </div>`;
        }
      }
    };

    loadMermaid();
  }, [content, type, diagramId]);

  return (
    <Box mb={6}>
      {title && (
        <Heading size="md" mb={3}>
          {title}
        </Heading>
      )}
      <Box 
        ref={containerRef} 
        borderWidth="1px" 
        borderRadius="md" 
        p={4} 
        bg="white"
        display="flex"
        justifyContent="center"
      >
        <Text color="gray.500">Loading diagram...</Text>
      </Box>
    </Box>
  );
};

// Available types of diagrams
export const DiagramTypes: DiagramConfig['type'][] = [
  'flowchart',
  'sequence',
  'class',
  'state',
  'er',
  'gantt'
];

// Examples with sample markdown for documentation
export const DiagramExamples = {
  flowchart: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
  
  sequence: `sequenceDiagram
    participant User
    participant System
    User->>System: Submit Request
    System->>Database: Query Data
    Database-->>System: Return Results
    System-->>User: Display Results`,
  
  class: `classDiagram
    class Component {
      +props: any
      +state: any
      +render() React.Node
    }
    class User {
      +id: string
      +name: string
      +email: string
    }
    Component <|-- UserComponent
    UserComponent -- User`,
};
