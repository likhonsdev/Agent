import React from 'react';
import { Container, Heading, Box, Text } from '@chakra-ui/react';
import { ChatInterface } from '../components/ChatInterface';

export const ChatPage: React.FC = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          AI Chat
        </Heading>
        <Text color="gray.600">
          Have a conversation with an AI assistant
        </Text>
      </Box>
      
      <Box height="70vh">
        <ChatInterface />
      </Box>
    </Container>
  );
};

export default ChatPage;
