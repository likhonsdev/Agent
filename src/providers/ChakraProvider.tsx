import { 
  ChakraProvider as BaseProvider, 
  type ChakraProviderProps 
} from '@chakra-ui/react';
import theme from '../theme';

interface Props {
  children: React.ReactNode;
}

export function ChakraThemeProvider({ children }: Props) {
  return (
    <BaseProvider theme={theme as ChakraProviderProps['theme']}>
      {children}
    </BaseProvider>
  );
}
