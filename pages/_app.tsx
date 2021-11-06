import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme';
import CSSReset from '@chakra-ui/css-reset';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider, createClient, fetchExchange, dedupExchange } from 'urql';
import {
  cacheExchange,
  Cache,
  QueryInput,
  query,
} from '@urql/exchange-graphcache';
import {
  LoginMutation,
  LogoutMutation,
  ProfileDocument,
  ProfileQuery,
  RegisterMutation,
} from '../generated/graphql';

const betterUpdateQuery = <Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  updateFn: (r: Result, q: Query) => Query
) => {
  return cache.updateQuery(
    queryInput,
    (data) => updateFn(result, data as any) as any
  );
};

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result: LoginMutation, args, cache, info) => {
            betterUpdateQuery<LoginMutation, ProfileQuery>(
              cache,
              {
                query: ProfileDocument,
              },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return { profile: result.login };
                }
              }
            );
          },
          register: (_result: RegisterMutation, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, ProfileQuery>(
              cache,
              {
                query: ProfileDocument,
              },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return { profile: result.register };
                }
              }
            );
          },
          logout: (_result: LogoutMutation, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, ProfileQuery>(
              cache,
              { query: ProfileDocument },
              _result,
              () => {
                return { profile: null };
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
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
  );
}
export default MyApp;
