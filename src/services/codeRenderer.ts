import { markdownService } from './markdownService';
import type { CodeBlock } from '../types';

export class CodeRendererService {
  /**
   * Render a code block with syntax highlighting
   */
  renderCode(code: string, language?: string): string {
    return markdownService.highlightCode(code, language);
  }

  /**
   * Process and render multiple code blocks from an AI response
   */
  processResponse(response: string): CodeBlock[] {
    return markdownService.processCodeBlocks(response);
  }

  /**
   * Extract and highlight code snippets from markdown
   */
  extractCodeSnippets(markdown: string): string[] {
    return markdownService.extractCodeSnippets(markdown);
  }

  /**
   * Detect the type/language of a code snippet
   */
  detectCodeType(code: string): CodeBlock['type'] {
    return markdownService.detectCodeType(code);
  }
}

export const codeRenderer = new CodeRendererService();
