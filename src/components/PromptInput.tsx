import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Textarea,
  Button,
  VStack,
  Flex,
  Text,
  HStack,
  Badge,
} from '@chakra-ui/react';
import './PromptInput.css';
import type { AIResponse } from '../types';
import { AIService } from '../services/ai';
import type { GenerationOptions } from '../services/ai';

interface PromptInputProps {
  onResponse: (response: AIResponse) => void;
  onThinkingUpdate?: (thinking: string[]) => void;
  initialPrompt?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  onResponse, 
  onThinkingUpdate,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [provider, setProvider] = useState<string>('');
  const [autoComplete, setAutoComplete] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [pendingResponse, setPendingResponse] = useState<AIResponse | null>(null);
  
  const aiService = AIService.getInstance();

  // Set default provider on first render
  useEffect(() => {
    if (!provider) {
      setProvider(aiService.getCurrentProvider());
    }
  }, [provider, aiService]);

  // Get available providers
  const providers = aiService.getAvailableProviders();

  // Debounced code completion
  const getSuggestions = useCallback(async (text: string) => {
    if (!autoComplete || text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const options: GenerationOptions = {
        provider,
        includeThinking: false,
      };
      
      const response = await aiService.generateCode(
        `Complete this code: ${text}`, 
        options
      );
      
      // Extract completion suggestions
      const extractedSuggestions = response.code
        .split('\n')
        .filter(s => s.startsWith(text))
        .slice(0, 5);
        
      setSuggestions(extractedSuggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
    }
  }, [autoComplete, provider, aiService]);

  // Handle autocompletion debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (prompt) {
        getSuggestions(prompt);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [prompt, getSuggestions]);

  // Apply suggestion to prompt
  const applySuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setSuggestions([]);
  };

  // Handle code generation
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    try {
      setIsLoading(true);
      
      // Define generation options
      const options: GenerationOptions = {
        provider,
        includeThinking: showThinking,
      };
      
      // Generate code with options
      const response = await aiService.generateCode(prompt, options);

      // If HITL approval is required, store response for approval
      if (requireApproval) {
        setPendingResponse(response);
        if (showThinking && response.thinking && onThinkingUpdate) {
          onThinkingUpdate(response.thinking);
        }
      } else {
        // Auto-approve if not requiring approval
        handleApproveResponse(response);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again later';
      alert(`Error generating code: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle response approval
  const handleApproveResponse = (response: AIResponse) => {
    // Send the response to parent
    onResponse(response);
    // Clear pending response
    setPendingResponse(null);
    
    alert('Code generated successfully');
  };

  // Handle response rejection
  const handleRejectResponse = () => {
    setPendingResponse(null);
    alert('Response rejected. Please try generating again with a different prompt');
  };

  return (
    <VStack gap={4} alignItems="stretch" className="prompt-input">
      <Box position="relative" backgroundColor="#FFFFFF" borderRadius="lg" p={4} boxShadow="md" borderWidth="1px">
        <Text mb={2} fontWeight="bold" fontSize="lg">Build with AI</Text>
        <Text mb={2} fontSize="sm" color="gray.500">Describe what you want to build</Text>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Create a responsive navigation bar with a logo, menu items, and a mobile hamburger menu"
          size="lg"
          rows={4}
          resize="vertical"
          mb={4}
        />
        
        {/* Code suggestions dropdown */}
        {suggestions.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            zIndex={10}
            bg="white"
            borderWidth="1px"
            borderRadius="md"
            maxH="200px"
            overflowY="auto"
            boxShadow="lg"
          >
            {suggestions.map((suggestion, index) => (
              <Box
                key={index}
                p={2}
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
                onClick={() => applySuggestion(suggestion)}
              >
                {suggestion}
              </Box>
            ))}
          </Box>
        )}
      
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
          <Box>
            <label htmlFor="ai-provider" style={{ marginRight: '8px', fontSize: '0.875rem' }}>
              AI Provider:
            </label>
            <select 
              id="ai-provider"
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '4px', borderColor: '#E2E8F0', marginLeft: '8px' }}
              aria-label="Select AI provider"
            >
              {providers.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </Box>
          
          <HStack style={{gap: "1rem"}}>
            <Box display="flex" alignItems="center">
              <label 
                htmlFor="show-thinking" 
                style={{ marginBottom: 0, fontSize: '0.875rem', marginRight: '8px' }}
              >
                Show thinking
              </label>
              <input 
                id="show-thinking"
                type="checkbox" 
                checked={showThinking} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowThinking(e.target.checked)}
                style={{ accentColor: "blue" }}
              />
            </Box>
            
            <Box display="flex" alignItems="center">
              <label 
                htmlFor="auto-complete" 
                style={{ marginBottom: 0, fontSize: '0.875rem', marginRight: '8px' }}
              >
                Auto-complete
              </label>
              <input 
                id="auto-complete"
                type="checkbox" 
                checked={autoComplete} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoComplete(e.target.checked)}
                style={{ accentColor: "blue" }}
              />
            </Box>
            
            <Box display="flex" alignItems="center">
              <label 
                htmlFor="require-approval" 
                style={{ marginBottom: 0, fontSize: '0.875rem', marginRight: '8px' }}
              >
                Require approval
              </label>
              <input 
                id="require-approval"
                type="checkbox" 
                checked={requireApproval} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequireApproval(e.target.checked)}
                style={{ accentColor: "blue" }}
              />
            </Box>
          </HStack>
          
          <Button
            colorScheme="blue"
            disabled={isLoading}
            onClick={handleSubmit}
            size="md"
          >
            Generate Code
          </Button>
        </Flex>
      </Box>

      {/* Pending response approval UI */}
      {pendingResponse && (
        <Box 
          mt={4} 
          p={4} 
          borderWidth="1px" 
          borderRadius="md" 
          bg="gray.50"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="bold">Review Generated Code</Text>
            <Badge colorScheme="orange">Pending Approval</Badge>
          </Flex>
          
          <Text mb={4} fontSize="sm">
            Review the generated code and approve if it meets your requirements.
          </Text>
          
          <HStack style={{gap: "1rem"}}>
            <Button
              colorScheme="green"
              onClick={() => handleApproveResponse(pendingResponse)}
              size="sm"
            >
              Approve & Use
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleRejectResponse}
              size="sm"
            >
              Reject
            </Button>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};
