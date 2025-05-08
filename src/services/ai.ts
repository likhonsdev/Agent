import { franc } from 'franc';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { ReactXMLParser } from './xmlParser';
import type { AIResponse, CodeBlock } from '../types';
import { extractCodeBlocks } from '../utils/markdown';
import { XMLElement } from '../types/xml';
import { CohereProvider, TogetherProvider, GroqProvider, GeminiProvider } from './aiProviders';
import fs from 'fs';

export interface GenerationOptions {
  provider?: string;
  includeThinking?: boolean;
  language?: string;
  systemPrompt?: string;
}

interface Version {
  xml: string;
  reactCode: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export class AIService {
  private static instance: AIService;
  private providers: Map<string, any>;
  private currentProvider: string = 'groq';
  private versions: Map<string, Version>;
  private parser: XMLParser;
  private reactXmlParser: ReactXMLParser;
  private systemPrompt: string;

  private constructor() {
    // Load the system prompt from the file
    try {
      this.systemPrompt = fs.readFileSync('src/components/prompt.txt', 'utf-8');
      console.log('Loaded system prompt from file');
    } catch (error) {
      console.error('Error loading system prompt:', error);
      this.systemPrompt = "You are an AI assistant that helps with code and UI components.";
    }
    this.providers = new Map();
    this.providers.set('cohere', new CohereProvider());
    this.providers.set('together', new TogetherProvider());
    this.providers.set('groq', new GroqProvider());
    this.providers.set('gemini', new GeminiProvider());
    
    this.versions = new Map();
    this.parser = new XMLParser({
      ignoreAttributes: false,
      preserveOrder: true,
      processEntities: true
    });
    this.reactXmlParser = new ReactXMLParser();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setProvider(provider: string): void {
    if (this.providers.has(provider)) {
      this.currentProvider = provider;
    } else {
      throw new Error(`Provider ${provider} not found`);
    }
  }

  public getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
  
  public getCurrentProvider(): string {
    return this.currentProvider;
  }
  
  public getSystemPrompt(): string {
    return this.systemPrompt;
  }

  public async generateCode(prompt: string, options: GenerationOptions = {}): Promise<AIResponse> {
    try {
      const providerName = options.provider || this.currentProvider;
      const provider = this.providers.get(providerName);
      
      if (!provider) {
        throw new Error('No AI provider configured');
      }

      let detectedLanguage = options.language;
      if (!detectedLanguage) {
        const langCode = franc(prompt);
        detectedLanguage = langCode === 'und' ? 'english' : langCode;
      }

      let thinking: string[] = [];
      if (options.includeThinking && provider.generateThinking) {
        try {
          thinking = await provider.generateThinking(prompt);
        } catch (err) {
          console.warn('Error generating thinking process, using fallback', err);
          thinking = [
            'Analyzing prompt requirements...',
            'Determining component structure...',
            'Planning responsive design approach...',
            'Generating code with appropriate styles and functionality...'
          ];
        }
      }

      const response = await provider.generateCode(prompt);
      
      return {
        ...response,
        thinking,
        prompt,
        metadata: {
          provider: providerName,
          promptLanguage: detectedLanguage,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error('Error generating code:', error);
      throw new Error(`Error generating code: ${error.message}`);
    }
  }

  public async processXML(xml: string, options: GenerationOptions = {}): Promise<AIResponse> {
    try {
      // Validate XML
      const validationResult = XMLValidator.validate(xml);
      if (validationResult !== true) {
        throw new Error(`Invalid XML: ${validationResult.err.msg}`);
      }

      // Parse XML to structured objects
      const parsedObj = this.parser.parse(xml);
      const parsedXML = this.reactXmlParser.parse(xml);

      // Validate structure using both parsers for robustness
      if (!parsedObj || Object.keys(parsedObj).length === 0) {
        throw new Error('Failed to parse XML structure');
      }

      // Convert to React
      const reactCode = this.reactXmlParser.toReact(parsedXML);

      // Generate optimized component with AI
      const prompt = `Optimize and enhance this React component with TypeScript and Chakra UI:\n\n${reactCode}`;
      const response = await this.generateCode(prompt, options);

      // Create version
      const versionId = crypto.randomUUID();
      const version: Version = {
        xml,
        reactCode: response.code,
        timestamp: new Date(),
        metadata: {
          ...response.metadata,
          originalStructure: parsedXML
        }
      };
      
      this.versions.set(versionId, version);

      return {
        ...response,
        metadata: {
          ...response.metadata,
          versionId
        }
      };
    } catch (error: any) {
      console.error('Error processing XML:', error);
      throw new Error(`Error processing XML: ${error.message}`);
    }
  }

  public getVersions(): Array<{ id: string; timestamp: Date; metadata: Record<string, any> }> {
    return Array.from(this.versions.entries()).map(([id, data]) => ({
      id,
      timestamp: data.timestamp,
      metadata: data.metadata
    }));
  }

  public getVersion(versionId: string): Version | undefined {
    return this.versions.get(versionId);
  }

  public extractCodeBlocks(text: string): CodeBlock[] {
    return extractCodeBlocks(text);
  }
}
