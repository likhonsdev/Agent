import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import { PromptInput } from '../components/PromptInput';
import { CodePreview, CodeBlocksViewer } from '../components/CodePreview';
import { AnimatedThinkingProcess } from '../components/ThinkingProcess';
import { CodeDebugger } from '../components/CodeDebugger';
import type { AIResponse, CodeBlock } from '../types';
import type { DebugInfo } from '../components/CodeDebugger';
import { AIService } from '../services/ai';
import { initDatabase, saveGeneratedComponent } from '../lib/db';

export const GeneratorPage: React.FC = () => {
  const [generatedCode, setGeneratedCode] = useState<AIResponse | null>(null);
  const [thinking, setThinking] = useState<string[]>([]);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  // Initialize database on component mount
  useEffect(() => {
    const initDb = async () => {
      try {
        await initDatabase();
        setIsDbInitialized(true);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initDb();
  }, []);

  // Extract code blocks when response changes
  useEffect(() => {
    if (generatedCode) {
      const aiService = AIService.getInstance();
      const extractedBlocks = aiService.extractCodeBlocks(generatedCode.code);
      
      if (extractedBlocks.length > 0) {
        setCodeBlocks(extractedBlocks);
      } else {
        // If no blocks extracted, create a single code block
        setCodeBlocks([{
          code: generatedCode.code,
          language: generatedCode.language,
          type: 'code'
        }]);
      }
      
      // Save to database if initialized
      if (isDbInitialized) {
        saveToDatabase(generatedCode);
      }
    }
  }, [generatedCode, isDbInitialized]);

  // Save generated code to database
  const saveToDatabase = async (response: AIResponse) => {
    try {
      await saveGeneratedComponent({
        prompt: response.prompt || 'Unknown prompt',
        code: response.code,
        language: response.language,
        provider: response.metadata?.provider || 'unknown',
        explanation: response.explanation
      });
      console.log('Generated component saved to database');
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  // Handle response from AI service
  const handleResponse = (response: AIResponse) => {
    setGeneratedCode(response);
  };

  // Handle thinking process updates
  const handleThinkingUpdate = (thinkingSteps: string[]) => {
    setThinking(thinkingSteps);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl" mb={4}>
          Generate Code with AI
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Describe what you want to build and let AI do the work
        </Text>
      </Box>

      <Box bg="white" p={6} borderRadius="lg" borderWidth="1px" mb={6}>
        <PromptInput 
          onResponse={handleResponse} 
          onThinkingUpdate={handleThinkingUpdate}
        />
      </Box>

      {thinking.length > 0 && (
        <AnimatedThinkingProcess steps={thinking} />
      )}

      {generatedCode && (
        <>
          <Box bg="white" p={6} borderRadius="lg" borderWidth="1px" mb={6}>
            {codeBlocks.length > 1 ? (
              <CodeBlocksViewer 
                codeBlocks={codeBlocks} 
                title="Generated Components" 
              />
            ) : (
              <CodePreview
                code={generatedCode.code}
                language={generatedCode.language}
                explanation={generatedCode.explanation}
                type="react"
              />
            )}
          </Box>
          
          {/* Add Code Debugger */}
          <CodeDebugger 
            code={generatedCode.code} 
            language={generatedCode.language}
            onDebug={(debugInfo: DebugInfo) => {
              console.log('Debug info:', debugInfo);
              // In a real implementation, you would save this to the database
              // or update the UI to show debugging information
            }}
            onRefactor={(refactoredCode: string) => {
              console.log('Refactored code:', refactoredCode);
              // In a real implementation, you would update the generated code
              // with the refactored version
              const updatedResponse = {
                ...generatedCode,
                code: refactoredCode,
                metadata: {
                  ...generatedCode.metadata,
                  refactored: true,
                  refactoredAt: new Date().toISOString()
                }
              };
              setGeneratedCode(updatedResponse);
            }}
          />
        </>
      )}
    </Container>
  );
};
