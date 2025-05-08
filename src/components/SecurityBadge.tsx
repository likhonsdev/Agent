import React from 'react';
import {
  Badge,
  Tooltip,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';

interface SecurityBadgeProps {
  level: 'low' | 'medium' | 'high';
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ level }) => {
  // Define colors based on security level
  const colorScheme = {
    low: 'red',
    medium: 'yellow',
    high: 'green'
  }[level];

  // Define security descriptions
  const securityDescription = {
    low: 'Basic security: Code execution is monitored but not fully sandboxed',
    medium: 'Enhanced security: Code runs in a restricted environment with limited permissions',
    high: 'Maximum security: Fully isolated sandbox with strict resource limitations'
  }[level];

  return (
    <Tooltip label={securityDescription} placement="top">
      <Flex align="center">
        <Badge
          display="flex"
          alignItems="center"
          colorScheme={colorScheme}
          borderRadius="full"
          px={2}
          py={1}
        >
          <HStack spacing={1}>
            <Icon as={LockIcon} w={3} h={3} />
            <span>Security: {level.charAt(0).toUpperCase() + level.slice(1)}</span>
          </HStack>
        </Badge>
      </Flex>
    </Tooltip>
  );
}; 