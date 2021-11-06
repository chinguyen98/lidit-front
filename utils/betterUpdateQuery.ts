import { Cache, QueryInput } from '@urql/exchange-graphcache';

export const betterUpdateQuery = <Result, Query>(
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
