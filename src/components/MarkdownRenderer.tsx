import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { renderMarkdown } from '../utils/markdown';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownRendererProps {
  /**
   * Markdown content to render
   */
  content: string;
  
  /**
   * Additional className for styling
   */
  className?: string;
}

/**
 * Renders markdown content with syntax highlighting
 * 
 * @param content - Markdown content to render
 * @param className - Additional className for custom styling
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Render markdown when content changes
  useEffect(() => {
    if (containerRef.current) {
      const html = renderMarkdown(content);
      containerRef.current.innerHTML = html;
      
      // Add behavior to links to open in new tab
      const links = containerRef.current.querySelectorAll('a');
      links.forEach(link => {
        if (link.hostname !== window.location.hostname) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      });
    }
  }, [content]);

  return (
    <Box
      ref={containerRef}
      className={`markdown-content ${className || ''}`}
      css={{
        // Base styles for markdown content
        'p, ul, ol, blockquote, table': {
          marginBottom: '1rem',
        },
        'h1, h2, h3, h4, h5, h6': {
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontWeight: 'bold',
          lineHeight: 1.2,
        },
        'h1': { fontSize: '1.8rem' },
        'h2': { fontSize: '1.5rem' },
        'h3': { fontSize: '1.3rem' },
        'h4': { fontSize: '1.1rem' },
        'h5': { fontSize: '1rem' },
        'h6': { fontSize: '0.9rem' },
        'ul, ol': {
          paddingLeft: '1.5rem',
        },
        'li': {
          marginBottom: '0.25rem',
        },
        'blockquote': {
          borderLeftWidth: '4px',
          borderLeftColor: 'gray.200',
          paddingLeft: '1rem',
          fontStyle: 'italic',
          color: 'gray.600',
        },
        'code': {
          fontFamily: 'monospace',
          backgroundColor: 'gray.100',
          padding: '0.125rem 0.25rem',
          borderRadius: '0.25rem',
          fontSize: '0.875em',
        },
        'pre': {
          marginBottom: '1rem',
          padding: '1rem',
          borderRadius: '0.375rem',
          overflow: 'auto',
          backgroundColor: 'gray.800',
        },
        'pre code': {
          backgroundColor: 'transparent',
          padding: 0,
          color: 'white',
        },
        'table': {
          width: '100%',
          borderCollapse: 'collapse',
        },
        'th, td': {
          borderWidth: '1px',
          borderColor: 'gray.200',
          padding: '0.5rem',
          textAlign: 'left',
        },
        'th': {
          backgroundColor: 'gray.50',
          fontWeight: 'bold',
        },
        'tr:nth-of-type(even)': {
          backgroundColor: 'gray.50',
        },
        'img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '0.375rem',
        },
        'a': {
          color: 'blue.500',
          textDecoration: 'underline',
        },
        'a:hover': {
          color: 'blue.600',
        },
        // Highlight.js overrides for better integration
        '.hljs': {
          background: 'none',
          padding: 0
        }
      }}
    />
  );
};
