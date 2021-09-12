import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme';
import CSSReset from '@chakra-ui/css-reset';
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ChakraProvider>
  )
}
export default MyApp
