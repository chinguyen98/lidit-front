import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme';
import CSSReset from '@chakra-ui/css-reset';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'urql';
import { createClient } from 'urql';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
        <ChakraProvider>
          <ThemeProvider theme={theme}>
            <CSSReset />
            <Component {...pageProps} />
          </ThemeProvider>
        </ChakraProvider>
    </Provider>
  )
}
export default MyApp
