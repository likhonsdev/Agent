import React, { useEffect, useRef } from 'react';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { getNormalizedLanguage } from '../utils/markdown';
import type { CodeBlock } from '../types';

interface CodeRendererProps {
  /**
   * Code content to render
   */
  code: string;
  
  /**
   * Programming language for syntax highlighting
   */
  language: string;
  
  /**
   * Optional filename
   */
  filename?: string;
  
  /**
   * Optional explanation text
   */
  explanation?: string;
  
  /**
   * Code block type
   */
  type?: CodeBlock['type'];
}

/**
 * Renders code with syntax highlighting using highlight.js
 */
export const CodeRenderer: React.FC<CodeRendererProps> = ({
  code,
  language,
  filename,
  explanation,
  type = 'code'
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = React.useState(false);
  
  // Colors for dark mode
  const bgColor = 'gray.800';
  const headerBgColor = 'gray.700';
  const borderColor = 'gray.600';
  
  // Normalize the language for highlight.js
  const normalizedLanguage = getNormalizedLanguage(language);
  
  // Apply syntax highlighting
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, normalizedLanguage]);
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box 
      borderWidth="1px" 
      borderColor={borderColor} 
      borderRadius="md" 
      mb={4} 
      overflow="hidden"
    >
      {/* Header with explanation and/or filename */}
      {(explanation || filename) && (
        <Box p={3} bg={headerBgColor} borderBottomWidth="1px" borderColor={borderColor}>
          {explanation && (
            <Text mb={filename ? 2 : 0} color="gray.200" fontSize="sm">
              {explanation}
            </Text>
          )}
          {filename && (
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold" color="blue.300" fontSize="sm">{filename}</Text>
              <Text fontSize="xs" color="purple.300" textTransform="uppercase">{type}</Text>
            </Flex>
          )}
        </Box>
      )}
      
      {/* Code block */}
      <Box position="relative">
        <Flex 
          position="absolute" 
          top={2} 
          right={2} 
          zIndex={1}
        >
          <Button
            size="sm"
            onClick={handleCopy}
            colorScheme={copied ? "green" : "gray"}
            variant="ghost"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <Text ml={2}>{copied ? "Copied" : "Copy"}</Text>
          </Button>
        </Flex>
        <Box
          position="relative"
          borderRadius={explanation || filename ? "0" : "md"}
          bg={bgColor}
          overflow="hidden"
          p={4}
        >
          <pre style={{ margin: 0, background: 'transparent' }}>
            <code ref={codeRef} className={normalizedLanguage}>
              {code}
            </code>
          </pre>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Renders multiple code blocks
 */
export const CodeBlocksViewer: React.FC<{
  codeBlocks: CodeBlock[];
  title?: string;
}> = ({ codeBlocks, title }) => {
  return (
    <Box>
      {title && (
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          {title}
        </Text>
      )}
      {codeBlocks.map((block, index) => (
        <CodeRenderer
          key={index}
          code={block.code}
          language={block.language}
          filename={block.filename}
          type={block.type}
        />
      ))}
    </Box>
  );
};
