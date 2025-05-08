import { useState } from 'react';

interface SandboxResult {
  success: boolean;
  output?: string;
  error?: string;
}

export function useCodeSandbox() {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async (code: string): Promise<SandboxResult> => {
    try {
      setIsExecuting(true);
      
      // This is a mock implementation
      // In a real app, this would send the code to a secure sandbox environment
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simple validation to avoid obvious errors
          if (code.includes('document.cookie') || code.includes('localStorage')) {
            resolve({
              success: false,
              error: 'Code contains potentially unsafe operations'
            });
            return;
          }
          
          resolve({
            success: true,
            output: 'Code executed successfully in sandbox'
          });
        }, 1000);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during execution'
      };
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executeCode,
    isExecuting
  };
} 