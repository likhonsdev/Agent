import React, { useState } from 'react';
import { Box, Container, Heading, Textarea, Button, Stack, HStack, Text } from '@chakra-ui/react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { CodeRenderer, CodeBlocksViewer } from '../components/CodeRenderer';
import { extractCodeBlocks } from '../utils/markdown';

const SAMPLE_MARKDOWN = `# Markdown Rendering Demo

This page demonstrates the markdown rendering capabilities using markdown-it and highlight.js.

## Code Blocks

Here's a TypeScript code example:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

function getUserById(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    });
}

// Example usage
getUserById('123')
  .then(user => console.log(user))
  .catch(error => console.error(error));
\`\`\`

## React Component Example

\`\`\`tsx
import React, { useState, useEffect } from 'react';

interface Props {
  initialCount: number;
}

export const Counter: React.FC<Props> = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(initialCount)}>Reset</button>
    </div>
  );
};
\`\`\`

## CSS Example

\`\`\`css
.counter {
  font-family: 'Arial', sans-serif;
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.counter h2 {
  color: #333;
  text-align: center;
}

.counter button {
  padding: 8px 16px;
  margin: 0 5px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.counter button:hover {
  background-color: #2a70c2;
}
\`\`\`

## HTML Example

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Counter Example</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="counter">
    <h2>Count: <span id="count">0</span></h2>
    <button id="decrement">-</button>
    <button id="increment">+</button>
    <button id="reset">Reset</button>
  </div>
  
  <script>
    let count = 0;
    const initialCount = 0;
    
    document.getElementById('increment').addEventListener('click', () => {
      count++;
      updateCount();
    });
    
    document.getElementById('decrement').addEventListener('click', () => {
      count--;
      updateCount();
    });
    
    document.getElementById('reset').addEventListener('click', () => {
      count = initialCount;
      updateCount();
    });
    
    function updateCount() {
      document.getElementById('count').textContent = count;
      document.title = \`Count: \${count}\`;
    }
  </script>
</body>
</html>
\`\`\`
`;

export const MarkdownDemoPage: React.FC = () => {
  const [markdownSource, setMarkdownSource] = useState(SAMPLE_MARKDOWN);
  const [showMarkdownSource, setShowMarkdownSource] = useState(true);
  const [extracted, setExtracted] = useState(false);
  
  // Extract code blocks for separate display
  const codeBlocks = extractCodeBlocks(markdownSource);
  
  return (
    <Container maxW="container.xl" py={8}>
      <Stack direction="column" gap={8}>
        <Heading as="h1">Markdown & Code Highlighting Demo</Heading>
        <Text>
          This demo showcases markdown rendering with markdown-it and code syntax highlighting with highlight.js.
        </Text>
        
        <HStack>
          <Button 
            colorScheme={showMarkdownSource ? "blue" : "gray"}
            onClick={() => setShowMarkdownSource(true)}
          >
            Edit Markdown
          </Button>
          <Button 
            colorScheme={!showMarkdownSource ? "blue" : "gray"}
            onClick={() => setShowMarkdownSource(false)}
          >
            Rendered Result
          </Button>
          <Button
            colorScheme={extracted ? "green" : "purple"}
            onClick={() => setExtracted(!extracted)}
          >
            {extracted ? "Hide" : "Show"} Extracted Code Blocks
          </Button>
        </HStack>
        
        <Box borderBottomWidth="1px" borderColor="gray.200" my={2} />
        
        {/* Markdown source editor */}
        {showMarkdownSource && (
          <Box>
            <Heading as="h2" size="md" mb={4}>Markdown Source</Heading>
            <Textarea
              value={markdownSource}
              onChange={(e) => setMarkdownSource(e.target.value)}
              height="400px"
              fontFamily="monospace"
            />
          </Box>
        )}
        
        {/* Rendered markdown view */}
        {!showMarkdownSource && (
          <Box>
            <Heading as="h2" size="md" mb={4}>Rendered Markdown</Heading>
            <Box borderWidth="1px" borderRadius="md" p={4}>
              <MarkdownRenderer content={markdownSource} />
            </Box>
          </Box>
        )}
        
        {/* Extracted code blocks */}
        {extracted && (
          <Box mt={8}>
            <Heading as="h2" size="md" mb={4}>Extracted Code Blocks</Heading>
            <CodeBlocksViewer codeBlocks={codeBlocks} />
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default MarkdownDemoPage;
