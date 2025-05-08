import type { AIResponse, CodeBlock } from '../types';
import { AIService } from './ai';

interface AIProvider {
  generateCode(prompt: string): Promise<AIResponse>;
  generateThinking?(prompt: string): Promise<string[]>;
}

export class CohereProvider implements AIProvider {
  private apiKey = process.env.COHERE_API_KEY;

  async generateCode(prompt: string): Promise<AIResponse> {
    try {
      const systemPrompt = AIService.getInstance().getSystemPrompt();

      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${systemPrompt}\n\nUser request: ${prompt}`,
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cohere API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract code blocks and explanations
      const text = data.generations[0].text;
      const codeBlockRegex = /```(?:typescript|tsx|jsx)?([\s\S]*?)```/g;
      const codeMatches = [...text.matchAll(codeBlockRegex)];
      
      let code = '';
      if (codeMatches.length > 0) {
        code = codeMatches[0][1].trim();
      } else {
        code = text;
      }
      
      // Get explanation (everything before the first code block)
      let explanation = '';
      if (codeMatches.length > 0) {
        const codeStart = text.indexOf('```');
        if (codeStart > 0) {
          explanation = text.substring(0, codeStart).trim();
        }
      }

      return {
        code,
        language: 'typescript',
        explanation: explanation || 'Generated with Cohere AI',
      };
    } catch (error: any) {
      console.error('Error in Cohere provider:', error);
      throw new Error(`Cohere provider error: ${error.message}`);
    }
  }
  
  async generateThinking(prompt: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Think step by step about how to create a UI component for: "${prompt}". List 3-5 key considerations, potential approaches, and design decisions. Format each point as a separate line starting with a number.`,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cohere API error: ${response.statusText}`);
      }

      const data = await response.json();
      const thinking = data.generations[0].text
        .split('\n')
        .filter((line: string) => line.trim().length > 0);
      
      return thinking;
    } catch (error: any) {
      console.error('Error generating thinking process:', error);
      return [
        'Analyzing component requirements...',
        'Determining appropriate structure...',
        'Planning responsive design approach...'
      ];
    }
  }
}

export class TogetherProvider implements AIProvider {
  private apiKey = process.env.TOGETHER_API_KEY;

  async generateCode(prompt: string): Promise<AIResponse> {
    try {
      const systemPrompt = AIService.getInstance().getSystemPrompt();
      
      const response = await fetch('https://api.together.xyz/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'codellama/CodeLlama-34b-Instruct-hf',
          prompt: `${systemPrompt}\n\nUser request: ${prompt}`,
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Together API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract code blocks and explanations
      const text = data.choices[0].text;
      const codeBlockRegex = /```(?:typescript|tsx|jsx)?([\s\S]*?)```/g;
      const codeMatches = [...text.matchAll(codeBlockRegex)];
      
      let code = '';
      if (codeMatches.length > 0) {
        code = codeMatches[0][1].trim();
      } else {
        code = text;
      }
      
      // Get explanation (everything before the first code block)
      let explanation = '';
      if (codeMatches.length > 0) {
        const codeStart = text.indexOf('```');
        if (codeStart > 0) {
          explanation = text.substring(0, codeStart).trim();
        }
      }

      return {
        code,
        language: 'typescript',
        explanation: explanation || 'Generated with Together AI',
      };
    } catch (error: any) {
      console.error('Error in Together provider:', error);
      throw new Error(`Together provider error: ${error.message}`);
    }
  }
  
  async generateThinking(prompt: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.together.xyz/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'codellama/CodeLlama-34b-Instruct-hf',
          prompt: `Think step by step about how to create a UI component for: "${prompt}". List 3-5 key considerations, potential approaches, and design decisions. Format each point as a separate line starting with a number.`,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Together API error: ${response.statusText}`);
      }

      const data = await response.json();
      const thinking = data.choices[0].text
        .split('\n')
        .filter((line: string) => line.trim().length > 0);
      
      return thinking;
    } catch (error: any) {
      console.error('Error generating thinking process:', error);
      return [
        'Analyzing component requirements...',
        'Determining appropriate structure...',
        'Planning responsive design approach...'
      ];
    }
  }
}

export class GroqProvider implements AIProvider {
  private apiKey = process.env.GROQ_API_KEY;

  async generateCode(prompt: string): Promise<AIResponse> {
    try {
      const systemPrompt = AIService.getInstance().getSystemPrompt();

      const response = await fetch('https://api.groq.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          prompt: `${systemPrompt}\n\nUser request: ${prompt}`,
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract code blocks and explanations
      const text = data.choices[0].text;
      const codeBlockRegex = /```(?:typescript|tsx|jsx)?([\s\S]*?)```/g;
      const codeMatches = [...text.matchAll(codeBlockRegex)];
      
      let code = '';
      if (codeMatches.length > 0) {
        code = codeMatches[0][1].trim();
      } else {
        code = text;
      }
      
      // Get explanation (everything before the first code block)
      let explanation = '';
      if (codeMatches.length > 0) {
        const codeStart = text.indexOf('```');
        if (codeStart > 0) {
          explanation = text.substring(0, codeStart).trim();
        }
      }

      return {
        code,
        language: 'typescript',
        explanation: explanation || 'Generated with Groq AI',
      };
    } catch (error: any) {
      console.error('Error in Groq provider:', error);
      throw new Error(`Groq provider error: ${error.message}`);
    }
  }

  async generateThinking(prompt: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.groq.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          prompt: `Think step by step about how to create a UI component for: "${prompt}". List 3-5 key considerations, potential approaches, and design decisions. Format each point as a separate line starting with a number.`,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const thinking = data.choices[0].text
        .split('\n')
        .filter((line: string) => line.trim().length > 0);
      
      return thinking;
    } catch (error: any) {
      console.error('Error generating thinking process:', error);
      return [
        'Analyzing component requirements...',
        'Determining appropriate structure...',
        'Planning responsive design approach...'
      ];
    }
  }
}

export class GeminiProvider implements AIProvider {
  private apiKey = process.env.GEMINI_API_KEY || '';
  
  async generateCode(prompt: string): Promise<AIResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }
      
      const systemPrompt = AIService.getInstance().getSystemPrompt();
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        } as HeadersInit,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nUser request: ${prompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract code blocks and explanations
      const codeBlockRegex = /```(?:typescript|tsx|jsx)?([\s\S]*?)```/g;
      const codeMatches = [...text.matchAll(codeBlockRegex)];
      
      let code = '';
      if (codeMatches.length > 0) {
        code = codeMatches[0][1].trim();
      } else {
        code = text;
      }
      
      // Get explanation (everything before the first code block)
      let explanation = '';
      if (codeMatches.length > 0) {
        const codeStart = text.indexOf('```');
        if (codeStart > 0) {
          explanation = text.substring(0, codeStart).trim();
        }
      }

      return {
        code,
        language: 'typescript',
        explanation: explanation || 'Generated with Gemini AI',
      };
    } catch (error: any) {
      console.error('Error in Gemini provider:', error);
      throw new Error(`Gemini provider error: ${error.message}`);
    }
  }
  
  async generateThinking(prompt: string): Promise<string[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        } as HeadersInit,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `Think step by step about how to create a UI component for: "${prompt}". List 3-5 key considerations, potential approaches, and design decisions. Format each point as a separate line starting with a number.` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const thinking = data.candidates[0].content.parts[0].text
        .split('\n')
        .filter((line: string) => line.trim().length > 0);
      
      return thinking;
    } catch (error: any) {
      console.error('Error generating thinking process:', error);
      return [
        'Analyzing component requirements...',
        'Determining appropriate structure...',
        'Planning responsive design approach...'
      ];
    }
  }
}
