import React, { useState } from 'react';
import { Box, Container, Heading, VStack, Input, Button, Text, Flex } from '@chakra-ui/react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const SimpleChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    
    // Add response message (mock AI response)
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${inputValue}"`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 1000);
    
    // Clear input
    setInputValue('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
import React, { useState } from 'react';
import { Box, Container, Heading, VStack, Input, Button, Text, Flex } from '@chakra-ui/react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const SimpleChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    
    // Add response message (mock AI response)
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${inputValue}"`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 1000);
    
    // Clear input
    setInputValue('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
        <Heading as="h1" size="xl" textAlign="center">
          Simple Chat Interface
        </Heading>
        
        <Box 
          borderWidth="1px" 
          borderRadius="lg" 
          p={4} 
          height="70vh" 
          display="flex" 
          flexDirection="column"
        >
          {/* Messages area */}
          <VStack 
            flex="1" 
            gap={4} 
            align="stretch" 
            overflowY="auto" 
            mb={4}
            p={2}
          >
        <Heading as="h1" size="xl" textAlign="center">
          Simple Chat Interface
        </Heading>
        
        <Box 
          borderWidth="1px" 
          borderRadius="lg" 
          p={4} 
          height="70vh" 
          display="flex" 
          flexDirection="column"
        >
          {/* Messages area */}
            {messages.map(message => (
              <Flex 
                key={message.id}
                justifyContent={message.isUser ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="80%"
                  bg={message.isUser ? 'blue.50' : 'gray.50'}
                  borderRadius="lg"
                  p={3}
                  boxShadow="sm"
                >
                  <Text>{message.text}</Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
          
          {/* Input area */}
          <Flex>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              mr={2}
            />
            <Button 
              colorScheme="blue" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            {messages.map(message => (
              <Flex 
                key={message.id}
                justifyContent={message.isUser ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="80%"
                  bg={message.isUser ? 'blue.50' : 'gray.50'}
                  borderRadius="lg"
                  p={3}
                  boxShadow="sm"
                >
                  <Text>{message.text}</Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
          
          {/* Input area */}
          <Flex>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              mr={2}
            />
            <Button 
              colorScheme="blue" 
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Flex>
        </Box>
      </VStack>
    </Container>
  );
};

export default SimpleChatPage;
