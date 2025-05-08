import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, Input, Button, useToast } from '@chakra-ui/react';
import { ChatMessage } from './ChatMessage';
import { ChatMessageType, Conversation } from '../types';
import { AIService } from '../services/ai';

interface ChatInterfaceProps {
  initialMessages?: ChatMessageType[];
  onConversationUpdate?: (conversation: Conversation) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialMessages = [],
  onConversationUpdate,
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const aiService = AIService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.generateCode(inputValue);
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: response.text || 'Sorry, I could not process your request.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (onConversationUpdate) {
        onConversationUpdate({
          messages: [...messages, userMessage, assistantMessage],
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box h="full" display="flex" flexDirection="column">
      <VStack
        flex="1"
        spacing={4}
        overflowY="auto"
        p={4}
        alignItems="stretch"
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </VStack>
      
      <Box as="form" onSubmit={handleSubmit} p={4} borderTop="1px" borderColor="gray.200">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          mr={2}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Sending..."
          mt={2}
          w="full"
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
