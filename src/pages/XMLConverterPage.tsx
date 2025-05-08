import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Textarea,
  Code,
  Badge,
  HStack,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { AIService } from '../services/ai';
import { VersionHistory } from '../components/VersionHistory';
import { SecurityBadge } from '../components/SecurityBadge';
import { useCodeSandbox } from '../hooks/useCodeSandbox';

interface VersionMetadata {
  provider?: string;
  promptLanguage?: string;
  timestamp?: string;
  versionId?: string;
  originalStructure?: Record<string, unknown>;
}

interface Version {
  id: string;
  timestamp: Date;
  metadata: VersionMetadata;
  xml: string;
  reactCode: string;
}

export function XMLConverterPage() {
  // Use simple mode variables instead of hooks
  const isDarkMode = false; // You can replace with a real implementation if needed
  const bgColor = isDarkMode ? 'gray.800' : 'white';
  const borderColor = isDarkMode ? 'gray.700' : 'gray.200';
  const codeBg = isDarkMode ? 'gray.900' : 'white';
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string | null>(null);
  const aiService = AIService.getInstance();
  const { executeCode } = useCodeSandbox();

  useEffect(() => {
    // Cast the result to Version[] since we know the structure
    const versionData = aiService.getVersions() as unknown as Version[];
    setVersions(versionData);
  }, [output]);

  const handleConvert = async () => {
    if (!input.trim()) {
      alert('Please enter XML to convert');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await aiService.processXML(input);
      
      // Secure execution in sandbox
      const sandboxResult = await executeCode(response.code);
      if (!sandboxResult.success) {
        throw new Error(sandboxResult.error);
      }

      setOutput(response.code);
      if (response.metadata) {
        setActiveVersion(response.metadata.versionId);
      }
      
      alert('XML converted to React component successfully');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Conversion Failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxW="container.2xl" p={8} height="100vh">
      <Grid
        templateColumns="1fr 300px"
        gap={8}
        height="full"
      >
        {/* Main Content */}
        <Flex direction="column" gap={6}>
          <HStack justify="space-between" align="center">
            <Heading size="xl">XML → React Converter</Heading>
            <SecurityBadge level="high" />
          </HStack>

          <Grid templateColumns="1fr 1fr" gap={6} height="70vh">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="<component>\n  <!-- Your XML here -->\n</component>"
              fontFamily="mono"
              fontSize="sm"
              borderRadius="lg"
              height="full"
              bg={bgColor}
            />
            
            <Box
              position="relative"
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Code
                display="block"
                whiteSpace="pre-wrap"
                p={4}
                borderRadius="lg"
                height="full"
                overflowY="auto"
                bg={codeBg}
              >
                {output || '// Generated component will appear here'}
              </Code>
              {isProcessing && (
                <Spinner 
                  size="lg"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                />
              )}
            </Box>
          </Grid>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleConvert}
            disabled={isProcessing}
          >
            {isProcessing ? 'Generating...' : 'Convert XML'}
            {!isProcessing && <Badge ml={2} colorScheme="blue">AI-Powered</Badge>}
          </Button>
        </Flex>

        {/* Version History */}
        <VersionHistory 
          versions={versions}
          activeVersion={activeVersion}
          onRestore={(versionId: string) => {
            const version = aiService.getVersion(versionId);
            if (version) {
              setInput(version.xml);
              setOutput(version.reactCode);
              setActiveVersion(versionId);
            }
          }}
        />
      </Grid>
    </Container>
  );
}
