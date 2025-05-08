export interface ProjectConfig {
  name: string;
  description: string;
  template: string;
}

export interface AIResponse {
  code: string;
  language: string;
  explanation: string;
  thinking?: string[];
  metadata?: Record<string, any>;
  codeBlocks?: CodeBlock[];
  prompt?: string;
}

export interface MDXComponent {
  name: string;
  props: Record<string, any>;
  children?: React.ReactNode;
}

export interface CodeBlock {
  code: string;
  language: string;
  filename?: string;
  projectPath?: string;
  type?: 'react' | 'nodejs' | 'html' | 'markdown' | 'diagram' | 'code' | 'mermaid' | 'svg' | 'text';
  highlighted?: string;
}

export interface ThinkingStep {
  content: string;
  status: 'complete' | 'in-progress' | 'pending';
}

export interface DatabaseConfig {
  url: string;
  ssl: boolean;
}

export interface AIProviderConfig {
  name: string;
  apiKey: string;
  url?: string;
  models?: string[];
}

export interface DiagramConfig {
  type: 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt';
  content: string;
  title?: string;
}

export type ComponentType = 
  | 'layout' 
  | 'navigation' 
  | 'form' 
  | 'data-display' 
  | 'feedback' 
  | 'overlay'
  | 'media'
  | 'utility';

export type MessageRole = 'user' | 'assistant' | 'system';

// Export XMLElement from xml.ts
export type { XMLElement } from './xml';

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  attachments?: {
    type: 'code' | 'image' | 'file';
    content: string;
    language?: string;
  }[];
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
