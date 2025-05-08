import { useEffect, useState } from 'react';
import { Box, Button, useClipboard } from '@chakra-ui/react';
import { markdownService } from '../services/markdownService';
import 'highlight.js/styles/github-dark.css';

interface CodeBlockRendererProps {
  code: string;
  language?: string;
  showCopy?: boolean;
}

export function CodeBlockRenderer({ code, language, showCopy = true }: CodeBlockRendererProps) {
  const [highlightedCode, setHighlightedCode] = useState('');
  const { hasCopied, onCopy } = useClipboard(code);

  useEffect(() => {
    const rendered = language ? 
      markdownService.highlightCode(code, language) : 
      markdownService.highlightCode(code);
    setHighlightedCode(rendered);
  }, [code, language]);

  return (
    <Box position="relative">
      {showCopy && (
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          onClick={onCopy}
          colorScheme="blue"
          variant="solid"
          opacity={0.8}
          _hover={{ opacity: 1 }}
        >
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
      )}
      <Box
        as="pre"
        className="hljs"
        p={4}
        borderRadius="md"
        overflow="auto"
        backgroundColor="gray.900"
        color="gray.100"
        fontSize="sm"
        position="relative"
      >
        <Box
          as="code"
          className={language ? `language-${language}` : ''}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </Box>
    </Box>
  );
}
