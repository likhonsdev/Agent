import { z } from 'zod';
import type { XMLElement } from '../types/xml';

/**
 * XML Parser service that handles parsing XML to React components and vice versa
 */
export class ReactXMLParser {
  /**
   * Parse XML string into a structured object representation
   */
  parse(xml: string, schema?: z.ZodSchema): XMLElement {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      
      if (doc.documentElement.nodeName === 'parsererror') {
        throw new Error('Invalid XML');
      }

      const result = this.nodeToObject(doc.documentElement);

      if (schema) {
        const validation = schema.safeParse(result);
        if (!validation.success) {
          throw new Error(`XML validation failed: ${validation.error.message}`);
        }
      }

      return result;
    } catch (error: any) {
      throw new Error(`XML parsing error: ${error.message}`);
    }
  }

  /**
   * Convert parsed XML object to React component string
   */
  toReact(element: XMLElement): string {
    const { tagName, attributes, children } = element;

    // Convert tag name to PascalCase for React components
    const componentName = this.toPascalCase(tagName);

    // Build props string from attributes
    const props = Object.entries(attributes || {})
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    // Convert children recursively
    const childContent = children?.map(child => {
      if (typeof child === 'string') {
        return child;
      }
      return this.toReact(child);
    }).join('\n') || '';

    // Return formatted component
    return `<${componentName}${props ? ' ' + props : ''}>${childContent ? '\n' + childContent + '\n' : ''}</${componentName}>`;
  }

  /**
   * Convert React component string back to XML
   */
  fromReact(component: string): string {
    // Basic JSX to XML conversion
    return component
      .replace(/<([A-Z][a-zA-Z]*)/g, (_, name) => `<${this.toKebabCase(name)}`)
      .replace(/<\/([A-Z][a-zA-Z]*)/g, (_, name) => `</${this.toKebabCase(name)}`);
  }

  private nodeToObject(node: Element): XMLElement {
    const result: XMLElement = {
      tagName: node.tagName.toLowerCase(),
      attributes: {},
      children: []
    };

    // Handle attributes
    Array.from(node.attributes).forEach(attr => {
      result.attributes![attr.name] = attr.value;
    });

    // Handle child nodes
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          result.children!.push(text);
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        result.children!.push(this.nodeToObject(child as Element));
      }
    });

    return result;
  }

  private toPascalCase(str: string): string {
    return str.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
  }

  private toKebabCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).slice(1);
  }
}

export const xmlParser = new ReactXMLParser();
