import React from 'react';
import { Box, VStack, HStack, Text, Circle, Divider } from '@chakra-ui/react';

interface Step {
  title: string;
  description: string;
}

interface LinearProcessFlowProps {
  steps: Step[];
}

export const LinearProcessFlow: React.FC<LinearProcessFlowProps> = ({ steps }) => {
  return (
    <VStack spacing={4} align="stretch" my={8}>
      {steps.map((step, index) => (
        <Box key={index}>
          <HStack spacing={4}>
            <Circle size="40px" bg="blue.500" color="white">
              {index + 1}
            </Circle>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">{step.title}</Text>
              <Text color="gray.600">{step.description}</Text>
            </VStack>
          </HStack>
          {index < steps.length - 1 && (
            <Box ml="20px" my={2}>
              <Divider orientation="vertical" height="20px" borderColor="blue.200" />
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  );
};
