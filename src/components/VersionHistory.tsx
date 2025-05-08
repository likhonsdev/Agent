import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Heading,
  Button,
  Flex,
} from '@chakra-ui/react';

interface Version {
  id: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

interface VersionHistoryProps {
  versions: Version[];
  activeVersion: string | null;
  onRestore: (versionId: string) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  activeVersion,
  onRestore,
}) => {
  // Format date for display
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box height="full" borderLeft="1px" p={4} overflowY="auto">
      <Heading size="md" mb={4}>Version History</Heading>
      
      {versions.length === 0 ? (
        <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Text color="gray.500">No versions yet</Text>
        </Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {versions.map(version => (
            <Box
              key={version.id}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              bg={activeVersion === version.id ? "blue.50" : "white"}
              borderColor={activeVersion === version.id ? "blue.500" : "gray.200"}
              _hover={{ borderColor: "blue.300" }}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Badge colorScheme={activeVersion === version.id ? "blue" : "gray"}>
                  {formatDate(version.timestamp)}
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {version.metadata.provider || 'AI'}
                </Text>
              </Flex>
              
              <HStack mb={2}>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                  {version.metadata.originalStructure 
                    ? `Components: ${Object.keys(version.metadata.originalStructure).length}`
                    : 'XML Conversion'
                  }
                </Text>
              </HStack>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRestore(version.id)}
                isDisabled={activeVersion === version.id}
                w="full"
              >
                {activeVersion === version.id ? 'Current' : 'Restore'}
              </Button>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}; 