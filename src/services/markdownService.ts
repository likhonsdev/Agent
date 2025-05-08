import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import type { CodeBlock } from '../types';

export class MarkdownService {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch (__) {
            // Ignore any errors and fallback to default
          }
        }
        // Fallback to default auto-detection
        return hljs.highlightAuto(str).value;
      }
    });
  }

  /**
   * Render markdown content to HTML
   */
  renderMarkdown(input: string): string {
    // Render the input and remove the surrounding <p> and </p> tags if present
    const rendered = this.md.render(input).trim();
    if (rendered.startsWith('<p>') && rendered.endsWith('</p>')) {
      return rendered.slice(3, -4);
    }
    return rendered;
  }

  /**
   * Extract code snippets from markdown text
   */
  extractCodeSnippets(markdownText: string): string[] {
    const codeSnippets: string[] = [];
    const codeBlockRegex = /```[\s\S]*?```/g;

    let matches;
    while ((matches = codeBlockRegex.exec(markdownText)) !== null) {
      // Remove the backticks and any language specifier from the match
      const codeSnippet = matches[0].replace(/```(?:\w+)?|```/g, '').trim();
      codeSnippets.push(codeSnippet);
    }

    return codeSnippets;
  }

  /**
   * Detect the type of code (HTML, Markdown, SVG, Mermaid, etc.)
   */
  detectCodeType(code: string): CodeBlock['type'] {
    if (!code || typeof code !== 'string') {
      return 'code';
    }

    const trimmedCode = code.trim();

    // Check for HTML
    if (trimmedCode.startsWith('<!DOCTYPE html>') || 
        trimmedCode.startsWith('<html') ||
        /<[a-z][\s\S]*>/i.test(trimmedCode)) {
      return 'html';
    }

    // Check for SVG
    if (trimmedCode.startsWith('<svg') && 
        trimmedCode.includes('</svg>') &&
        trimmedCode.includes('xmlns="http://www.w3.org/2000/svg"')) {
      return 'svg';
    }

    // Check for Mermaid
    const mermaidPatterns = [
      /graph\s+[A-Za-z\s]/i,
      /flowchart\s+[A-Za-z\s]/i,
      /sequenceDiagram/i,
      /classDiagram/i,
      /stateDiagram/i,
      /erDiagram/i,
      /gantt/i,
      /pie/i,
      /journey/i
    ];

    if (mermaidPatterns.some(pattern => pattern.test(trimmedCode))) {
      return 'mermaid';
    }

    // Check for Markdown
    const markdownPatterns = [
      /^#\s+/m,              // Headers
      /^\s*[*-]\s+/m,        // List items
      /^\d+\.\s+/m,          // Numbered lists
      /^\s*>\s+/m,           // Blockquotes
      /\[.+\]\(.+\)/,        // Links
      /!\[.+\]\(.+\)/,       // Images
      /\*\*.+\*\*/,          // Bold
      /__.+__/,              // Bold (alt)
      /\*.+\*/,              // Italic
      /_.+_/,                // Italic (alt)
      /^```[\s\S]*?```/m,    // Code blocks
      /^\|.+\|.+\|/m         // Tables
    ];

    if (markdownPatterns.some(pattern => pattern.test(trimmedCode))) {
      return 'markdown';
    }

    return 'code';
  }

  /**
   * Process code blocks in AI responses
   */
  processCodeBlocks(response: string): CodeBlock[] {
    const blocks = this.extractCodeBlocks(response);
    return blocks.map(block => {
      // If no language is provided, try to detect one based on content
      const language = block.language || this.detectLanguageFromContent(block.content);
      const type = this.detectCodeType(block.content);
      return {
        code: block.content,
        language: language || 'plaintext', // Ensure we always have a language
        type,
        highlighted: this.highlightCode(block.content, language)
      };
    });
  }

  /**
   * Extract code blocks with metadata
   */
  private extractCodeBlocks(content: string): Array<{ content: string; language?: string }> {
    const blocks: Array<{ content: string; language?: string }> = [];
    const codeBlockRegex = /```(\w+)?\s*(?:(.+\.\w+))?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1];
      const code = match[3].trim();
      blocks.push({ content: code, language });
    }

    return blocks;
  }

  /**
   * Try to detect the language from code content if not specified
   */
  private detectLanguageFromContent(code: string): string | undefined {
    // Common patterns that might indicate the language
    const patterns: [RegExp, string][] = [
      [/^import\s+.*\s+from\s+['"].*['"];?$/m, 'typescript'],
      [/^const\s+.*\s+=\s+require\(['"].*['"]\);?$/m, 'javascript'],
      [/<\/?[a-z][\s\S]*>/i, 'html'],
      [/^import\s+.*\s+{.*}\s+from\s+['"].*['"];?$/m, 'typescript'],
      [/^def\s+\w+\s*\([^)]*\):$/m, 'python'],
      [/^package\s+\w+(\.\w+)*;$/m, 'java'],
      [/^using\s+\w+(\.\w+)*;$/m, 'csharp'],
      [/^\$\w+\s*=\s*.+;$/m, 'php'],
      [/^fn\s+\w+\s*\([^)]*\)\s*->.*{$/m, 'rust']
    ];

    for (const [pattern, lang] of patterns) {
      if (pattern.test(code)) {
        return lang;
      }
    }

    return undefined;
  }

  /**
   * Highlight code using highlight.js
   */
  highlightCode(code: string, language?: string): string {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value;
      } catch (e) {
        console.warn('Failed to highlight code:', e);
      }
    }
    return hljs.highlightAuto(code).value;
  }
}

// Export singleton instance
export const markdownService = new MarkdownService();
