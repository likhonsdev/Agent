import type { CodeBlock } from '../types';

/**
 * Utility functions for MDX processing
 */

/**
 * Extracts content from a specific tag in the MDX content
 */
export function extractTag(content: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, "gs");
  const matches = content.match(regex);

  if (!matches) return "";

  // Join all matches and remove the tags
  return matches.map((match) => {
    return match.replace(new RegExp(`<${tagName}>|<\/${tagName}>`, "g"), "");
  }).join("\n");
}

/**
 * Parses MDX content and extracts enhanced code blocks and components
 */
export function parseEnhancedMDX(content: string): {
  codeBlocks: CodeBlock[];
  components: string[];
  content: string;
} {
  const codeBlocks = extractCodeBlocks(content);
  const components = extractComponents(content);

  return {
    codeBlocks,
    components,
    content,
  };
}

/**
 * Extracts code blocks from MDX content with enhanced metadata
 */
function extractCodeBlocks(content: string): CodeBlock[] {
  const regex = /```(\w+)\s+(?:project="([^"]+)")?\s*(?:file="([^"]+)")?\s*(?:type="([^"]+)")?([\s\S]*?)```/g;
  const blocks: CodeBlock[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [, language, project, file, type, code] = match;
    blocks.push({
      language: language || 'text',
      code: code.trim(),
      filename: file,
      projectPath: project,
      type: type as CodeBlock['type'] || 'code'
    });
  }

  return blocks;
}

/**
 * Extracts components from MDX content
 */
function extractComponents(content: string): string[] {
  const componentRegex = /(<[A-Z][a-zA-Z0-9]*)/g;
  const components = new Set<string>();
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    components.add(match[1].slice(1)); // Remove <
  }

  return Array.from(components);
}

/**
 * Detects if the MDX content contains unsafe or inappropriate material
 */
export function detectUnsafe(mdxTree: any): boolean {
  // This is a simplified implementation
  // In a real-world scenario, you would implement more sophisticated checks
  const unsafePatterns = [
    /eval\s*\(/i,
    /document\.cookie/i,
    /localStorage\./i,
    /sessionStorage\./i,
    /window\.open\s*\(\s*['"]https?:\/\/[^'"]+['"]/i,
    /window\.open/i,
    /Function\(/i,
    /setTimeout\s*\(/i,
  ];

  const content = mdxTree.content.toLowerCase();

  // Check for unsafe patterns in the content
  for (const pattern of unsafePatterns) {
    if (pattern.test(content)) {
      return true;
    }
  }

  // Check code blocks for unsafe patterns
  for (const block of mdxTree.codeBlocks) {
    const code = block.code.toLowerCase();
    for (const pattern of unsafePatterns) {
      if (pattern.test(code)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extracts file structure from MDX content
 */
export function extractFileStructure(mdxTree: any): { 
  type: 'directory' | 'file';
  name: string;
  path: string;
  children?: any[];
  language?: string;
}[] {
  const files = mdxTree.codeBlocks
    .filter((block: any) => block.file)
    .map((block: any) => {
      const parts = block.file.split('/');
      const fileName = parts.pop();
      const directory = parts.join('/');

      return {
        path: block.file,
        name: fileName,
        directory,
        language: block.language,
        project: block.project || 'default',
      };
    });

  // Group files by directory to create a tree structure
  const fileTree = groupFilesByDirectory(files);

  return fileTree;
}

/**
 * Groups files by directory to create a tree structure
 */
function groupFilesByDirectory(files: any[]): any[] {
  const tree: any[] = [];
  const directoryMap: Record<string, any> = {};

  // First pass: create directory nodes
  files.forEach((file) => {
    if (file.directory) {
      const dirs = file.directory.split('/');
      let currentPath = '';

      dirs.forEach((dir) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${dir}` : dir;

        if (!directoryMap[currentPath]) {
          const dirNode = {
            type: 'directory',
            name: dir,
            path: currentPath,
            children: [],
          };

          directoryMap[currentPath] = dirNode;

          if (parentPath) {
            directoryMap[parentPath].children.push(dirNode);
          } else {
            tree.push(dirNode);
          }
        }
      });
    }
  });

  // Second pass: add files to their directories
  files.forEach((file) => {
    const fileNode = {
      type: 'file',
      name: file.name,
      path: file.path,
      language: file.language,
    };

    if (file.directory && directoryMap[file.directory]) {
      directoryMap[file.directory].children.push(fileNode);
    } else {
      tree.push(fileNode);
    }
  });

  return tree;
}

/**
 * Gets the language of the MDX content using the franc library
 */
export function detectLanguage(content: string): string {
  // We could use the franc library here if needed
  // For now we'll default to English
  return 'en';
}
