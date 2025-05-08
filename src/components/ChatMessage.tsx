import React from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Code,
  Heading,
} from '@chakra-ui/react';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const bgColor = 'white';
  const borderColor = 'gray.200';
  const userBg = 'blue.50';
  const assistantBg = bgColor;
  const systemBg = 'purple.50';
  
  const messageBg = message.role === 'user' 
    ? userBg 
    : message.role === 'system' 
      ? systemBg 
      : assistantBg;
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  return (
    <Box 
      bg={messageBg}
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      mb={4}
      position="relative"
      boxShadow="sm"
      maxW="100%"
      opacity={message.isLoading ? 0.7 : 1}
    >
      <Flex align="center" mb={2}>
        <Box
          width="32px"
          height="32px"
          borderRadius="full"
          bg={message.role === 'user' ? 'blue.500' : 'green.500'}
          color="white"
          mr={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
        >
          {message.role === 'user' ? 'U' : 'A'}
        </Box>
        <Heading size="sm" textTransform="capitalize">
          {message.role}
        </Heading>
        <Text fontSize="xs" color="gray.500" ml="auto">
          {formattedTime}
        </Text>
        {message.isLoading && (
          <Badge ml={2} colorScheme="yellow">
            Loading...
          </Badge>
        )}
      </Flex>
      
      <Box pl={10}>
        <MarkdownRenderer content={message.content} />
        
        {message.attachments && message.attachments.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="bold" mb={2}>Attachments:</Text>
            {message.attachments.map((attachment, index) => (
              <Box 
                key={index} 
                p={3} 
                borderWidth="1px" 
                borderRadius="md" 
                mt={2}
                bg={'gray.50'}
              >
                {attachment.type === 'code' ? (
                  <Box>
                    <Badge mb={2} colorScheme="purple">
                      {attachment.language || 'code'}
                    </Badge>
                    <Code display="block" whiteSpace="pre" p={2} borderRadius="md" overflowX="auto">
                      {attachment.content}
                    </Code>
                  </Box>
                ) : (
                  <Text>{attachment.content}</Text>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
