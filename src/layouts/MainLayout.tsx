import React from 'react';
import { Box, Container, Flex, VStack } from '@chakra-ui/react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={8}>
        <Flex gap={8}>
          <VStack flex={1} spacing={6} align="stretch">
            {children}
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};
