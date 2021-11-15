import { dedupExchange, Exchange, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  LogoutMutation,
  ProfileDocument,
  ProfileQuery,
  RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import Router from 'next/dist/client/router';

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes('Not authenticated!')) {
          Router.replace('/login');
        }
      })
    );
  };

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
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
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
