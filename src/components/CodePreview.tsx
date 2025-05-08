import React, { useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import type { CodeBlock } from '../types';
import 'highlight.js/styles/github-dark.css';
import './CodePreview.css';

// Declare Prism for TypeScript
declare const Prism: any;

interface CodePreviewProps {
  code: string;
  language: string;
  explanation?: string;
  filename?: string;
  type?: CodeBlock['type'];
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language,
  explanation,
  filename,
  type = 'code',
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Map language strings to Prism language classes
  const getPrismLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      tsx: 'tsx',
      jsx: 'jsx',
      typescript: 'typescript',
      ts: 'typescript',
      javascript: 'javascript',
      js: 'javascript',
      html: 'markup',
      css: 'css',
      json: 'json',
    };

    return langMap[lang.toLowerCase()] || 'typescript';
  };

  // Apply syntax highlighting when component mounts or code changes
  useEffect(() => {
    if (codeRef.current && typeof Prism !== 'undefined') {
      try {
        Prism.highlightElement(codeRef.current);
      } catch (e) {
        console.error('Failed to highlight code:', e);
      }
    }
  }, [code, language]);

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box className="code-preview-container">
      {/* Header with explanation and/or filename */}
      {(explanation || filename) && (
        <Box className="code-preview-header">
          {explanation && (
            <Text className="code-preview-explanation">
              {explanation}
            </Text>
          )}
          {filename && (
            <Flex className="code-preview-file-header">
              <Text className="code-preview-filename">{filename}</Text>
              <Text className="code-preview-type">{type}</Text>
            </Flex>
          )}
        </Box>
      )}
      
      {/* Code block */}
      <Box position="relative">
        <Flex className="code-preview-actions">
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
        <Box className="code-preview-code">
          <pre className={`language-${getPrismLanguage(language)}`}>
            <code ref={codeRef} className={`language-${getPrismLanguage(language)}`}>
              {code}
            </code>
          </pre>
        </Box>
      </Box>
    </Box>
  );
};

// Component for displaying multiple code blocks
export const CodeBlocksViewer: React.FC<{
  codeBlocks: CodeBlock[];
  title?: string;
}> = ({ codeBlocks, title }) => {
  return (
    <Box>
      {title && (
        <Heading as="h3" size="md" mb={4}>
          {title}
        </Heading>
      )}
      {codeBlocks.map((block, index) => (
        <CodePreview
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
