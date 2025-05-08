/**
 * This is a compatibility layer for Chakra UI v3
 * It provides simple implementations of hooks that were removed or changed
 */

// Simple replacement for useColorMode
export function useColorMode() {
  // Since we can't easily access Chakra's theme in v3,
  // we'll use a simple implementation that defaults to light mode
  // This could be enhanced with localStorage or system preference detection
  return {
    colorMode: 'light',
    toggleColorMode: () => {
      console.warn('Color mode toggle is not implemented');
    }
  };
}

// Simple replacement for useToast
export function useToast() {
  return (props: {
    title?: string;
    description?: string;
    status?: 'info' | 'warning' | 'success' | 'error';
    duration?: number;
    isClosable?: boolean;
  }) => {
    const { title, description, status } = props;
    
    // Simple implementation using alert
    // In a real app, you'd want a proper toast component
    let message = '';
    if (title) message += title;
    if (description) message += message ? `: ${description}` : description;
    
    alert(message);
    
    // Return an empty ID that would normally be used to close the toast
    return '';
  };
} 