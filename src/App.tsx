import { Box, Text, Button, Container, Heading } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { XMLConverterPage } from './pages/XMLConverterPage'
import { MarkdownDemoPage } from './pages/MarkdownDemoPage'
import { ChatPage } from './pages/ChatPage'
import { ChakraThemeProvider } from './providers/ChakraProvider'
import './App.css'

function HomePage() {
  const navigate = useNavigate();
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" py={10}>
        <Heading as="h1" size="2xl" mb={4}>
          Sheikh - AI-Powered Web Development
        </Heading>
        <Text fontSize="xl" color="gray.600" mb={6}>
          Build apps & sites with natural language prompts and chat with AI
        </Text>
        <Box>
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => navigate('/xml-converter')}
            mr={4}
          >
            XML Converter
          </Button>
          <Button
            size="lg"
            colorScheme="purple"
            onClick={() => navigate('/markdown-demo')}
            mr={4}
          >
            Markdown Demo
          </Button>
          <Button
            size="lg"
            colorScheme="teal"
            onClick={() => navigate('/chat')}
          >
            AI Chat
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <ChakraThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/xml-converter" element={<XMLConverterPage />} />
            <Route path="/markdown-demo" element={<MarkdownDemoPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ChakraThemeProvider>
  )
}

export default App
