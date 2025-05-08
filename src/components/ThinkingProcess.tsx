Human-in-the-Loop approach bridges AI automation with human expertise, making it ideal for education, startups, and collaborative coding.  import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { CheckIcon, InfoIcon } from '@chakra-ui/icons';
import type { ThinkingStep } from '../types';

interface ThinkingProcessProps {
  steps: (string | ThinkingStep)[];
  currentStepIndex?: number;
}

export const ThinkingProcess: React.FC<ThinkingProcessProps> = ({
  steps,
  currentStepIndex = -1
}) => {
  // Convert simple string steps to ThinkingStep objects
  const normalizedSteps: ThinkingStep[] = steps.map((step, index) => {
    if (typeof step === 'string') {
      return {
        content: step,
        status: 
          index < currentStepIndex ? 'complete' :
          index === currentStepIndex ? 'in-progress' : 'pending'
      };
    }
    return step;
  });

  const bgColor = 'gray.50';
  const borderColor = 'gray.200';

  return (
    <Box 
      bg={bgColor} 
      p={4} 
      borderRadius="md" 
      border="1px" 
      borderColor={borderColor}
      mb={4}
    >
      <Text fontWeight="medium" mb={3}>
        <Icon as={InfoIcon} mr={2} color="blue.500" />
        Chain of Thought
      </Text>
      <VStack gap={2} alignItems="start" pl={2}>
        {normalizedSteps.map((step, index) => (
          <HStack key={index} opacity={step.status === 'pending' ? 0.5 : 1}>
            {step.status === 'complete' ? (
              <Icon as={CheckIcon} color="green.500" />
            ) : step.status === 'in-progress' ? (
              <Spinner size="xs" color="blue.500" />
            ) : (
              <Box w="1em" h="1em" />
            )}
            <Text fontSize="sm">{step.content}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

// Simple animation to simulate AI thinking
export const AnimatedThinkingProcess: React.FC<{
  steps: string[];
  onComplete?: () => void;
  autoPlay?: boolean;
  speed?: number;
}> = ({ steps, onComplete, autoPlay = true, speed = 1000 }) => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(autoPlay ? 0 : -1);

  React.useEffect(() => {
    if (!autoPlay || currentStepIndex < 0) return;
    
    if (currentStepIndex >= steps.length) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length, autoPlay, speed, onComplete]);

  return <ThinkingProcess steps={steps} currentStepIndex={currentStepIndex} />;
};
