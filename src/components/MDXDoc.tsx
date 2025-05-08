import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { parseEnhancedMDX, detectUnsafe } from '../utils/mdx';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CodeBlockRenderer } from './CodeBlockRenderer';

interface MDXDocProps {
  /**
   * The MDX content to render
   */
  content: string;
  /**
   * Optional title for the documentation section
   */
  title?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Component for rendering MDX documentation with code examples and components
 */
export const MDXDoc: React.FC<MDXDocProps> = ({ content, title, className }) => {
  const parsed = parseEnhancedMDX(content);
  const isUnsafe = detectUnsafe(parsed);

  if (isUnsafe) {
    return (
      <Box p={4} bg="red.100" color="red.800" borderRadius="md">
        <Text>This MDX content contains potentially unsafe code and cannot be rendered.</Text>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {title && (
        <Heading as="h1" size="xl" mb={6}>
          {title}
        </Heading>
      )}

      <Box mb={8}>
        <MarkdownRenderer content={content} />
      </Box>

      {parsed.codeBlocks.length > 0 && (
        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>
            Code Examples
          </Heading>
          {parsed.codeBlocks.map((block, i) => (
            <Box key={i} mb={6}>
              {block.filename && (
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {block.filename}
                </Text>
              )}
              <CodeBlockRenderer
                code={block.code}
                language={block.language}
                showCopy={true}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

/**
 * HOC for wrapping MDX content with the MDXDoc component
 */
export function withMDXDoc(content: string) {
  return function MDXDocWrapper(props: Omit<MDXDocProps, 'content'>) {
    return <MDXDoc content={content} {...props} />;
  };
}
