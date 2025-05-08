import { useRef, useEffect, useState } from 'react';
import type { SandboxResult } from '../types';

const SANDBOX_TIMEOUT = 5000; // 5 seconds timeout

/**
 * Custom hook for secure code execution in an isolated environment
 */
export function useCodeSandbox() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      // Create a secure iframe
      const iframe = iframeRef.current;
      iframe.sandbox.add('allow-scripts');
      iframe.src = 'about:blank';

      // Setup messaging
      const handleMessage = (event: MessageEvent) => {
        if (event.source === iframe.contentWindow) {
          // Handle messages from sandbox
          console.log('Sandbox message:', event.data);
        }
      };

      window.addEventListener('message', handleMessage);
      setIsReady(true);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  /**
   * Execute code in the sandbox with a timeout
   */
  const executeCode = async (code: string): Promise<SandboxResult> => {
    if (!iframeRef.current || !isReady) {
      throw new Error('Sandbox not ready');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Code execution timed out'));
      }, SANDBOX_TIMEOUT);

      try {
        // Wrap code in try-catch and restrict access to sensitive APIs
        const wrappedCode = `
          try {
            const restricted = [
              'localStorage',
              'sessionStorage',
              'indexedDB',
              'fetch',
              'XMLHttpRequest',
              'WebSocket',
              'Worker',
              'SharedWorker'
            ];

            restricted.forEach(api => {
              if (window[api]) {
                delete window[api];
              }
            });

            // Execute user code
            ${code}
          } catch (error) {
            window.parent.postMessage({
              type: 'error',
              error: error.message
            }, '*');
          }
        `;

        const messageHandler = (event: MessageEvent) => {
          if (event.source === iframeRef.current?.contentWindow) {
            clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);

            if (event.data.type === 'error') {
              resolve({
                success: false,
                error: event.data.error
              });
            } else {
              resolve({
                success: true,
                result: event.data.result
              });
            }
          }
        };

        window.addEventListener('message', messageHandler);
        iframeRef.current!.contentWindow!.postMessage({ code: wrappedCode }, '*');
      } catch (error: any) {
        clearTimeout(timeout);
        reject(new Error(`Sandbox error: ${error.message}`));
      }
    });
  };

  return {
    iframeRef,
    isReady,
    executeCode
  };
}

/**
 * Component for rendering the secure sandbox iframe
 */
export function CodeSandbox() {
  return (
    <iframe
      ref={iframeRef}
      style={{ display: 'none' }}
      title="Code Sandbox"
      sandbox="allow-scripts"
    />
  );
}

/**
 * Validate code for potential security issues
 */
export function validateCode(code: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for potentially dangerous APIs
  const dangerousPatterns = [
    { pattern: /eval\(/, message: 'Use of eval() is not allowed' },
    { pattern: /new Function\(/, message: 'Dynamic function creation is not allowed' },
    { pattern: /process\./, message: 'Access to Node.js process is not allowed' },
    { pattern: /require\(/, message: 'Use of require() is not allowed' },
    { pattern: /import\(/, message: 'Dynamic imports are not allowed' }
  ];

  dangerousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      issues.push(message);
    }
  });

  return {
    isValid: issues.length === 0,
    issues
  };
}
