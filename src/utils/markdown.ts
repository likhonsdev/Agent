import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import type { CodeBlock } from '../types';

// Initialize markdown-it with highlight.js integration
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (e) {
        console.error('Highlight.js error:', e);
      }
    }
    
    // Use external default escaping if language not found
    return '';
  }
});

// Language mapping for both markdown-it and highlight.js
const languageMap: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  java: 'java',
  cs: 'csharp',
  php: 'php',
  rs: 'rust',
  c: 'c',
  cpp: 'cpp',
  html: 'html',
  css: 'css',
  scss: 'scss',
  json: 'json',
  yml: 'yaml',
  yaml: 'yaml',
  md: 'markdown',
  bash: 'bash',
  sh: 'shell',
  sql: 'sql',
  graphql: 'graphql',
  swift: 'swift',
  kotlin: 'kotlin',
  dart: 'dart',
  xml: 'xml',
  dockerfile: 'dockerfile',
};

/**
 * Get normalized language identifier for highlighting
 */
export const getNormalizedLanguage = (lang: string): string => {
  const lowerLang = lang.toLowerCase();
  return languageMap[lowerLang] || lowerLang;
};

/**
 * Render markdown content to HTML with syntax highlighting
 */
export const renderMarkdown = (content: string): string => {
  return md.render(content);
};

/**
 * Extract code blocks from markdown text
 */
export const extractCodeBlocks = (text: string): CodeBlock[] => {
  const codeBlocks: CodeBlock[] = [];
  const codeBlockRegex = /```(?:([\w-]+)?)?\s*(?:(.+\.[\w]+))?\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || 'plaintext';
    const filename = match[2];
    const code = match[3].trim();
    
    let type: CodeBlock['type'] = 'code';
    
    // Determine the code block type based on language or filename
    if (
      language === 'jsx' || 
      language === 'tsx' || 
      language === 'react' || 
      (filename && (filename.endsWith('.jsx') || filename.endsWith('.tsx')))
    ) {
      type = 'react';
    } else if (language === 'html' || (filename && filename.endsWith('.html'))) {
      type = 'html';
    } else if (language === 'markdown' || language === 'md' || (filename && filename.endsWith('.md'))) {
      type = 'markdown';
    } else if (language === 'mermaid') {
      type = 'diagram';
    } else if (
      language === 'js' || 
      language === 'javascript' || 
      (filename && (filename.endsWith('.js') || filename.endsWith('.cjs') || filename.endsWith('.mjs')))
    ) {
      type = 'nodejs';
    }
    
    codeBlocks.push({
      code,
      language: getNormalizedLanguage(language),
      filename,
      type
    });
  }
  
  return codeBlocks;
};

/**
 * Determine MIME type based on file extension
 */
export const getMimeTypeFromFilename = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
    case 'md':
      return 'text/markdown';
    case 'txt':
      return 'text/plain';
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
    case 'xml':
      return 'application/xml';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Determine if a file is a text file based on MIME type
 */
export const isTextFile = (mimeType: string): boolean => {
  return (
    mimeType.startsWith('text/') || 
    mimeType === 'application/javascript' || 
    mimeType === 'application/json' || 
    mimeType === 'application/xml' ||
    mimeType === 'application/xhtml+xml'
  );
};

/**
 * Determine if a file is an image based on MIME type
 */
export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

/**
 * Determine the language for a file based on its extension or filename
 */
export const getLanguageFromFilename = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  if (languageMap[extension]) {
    return languageMap[extension];
  }
  
  // Check for special cases
  if (filename.toLowerCase() === 'dockerfile') {
    return 'dockerfile';
  }
  
  return extension || 'plaintext';
};
