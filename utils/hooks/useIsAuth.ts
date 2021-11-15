import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { useProfileQuery } from '../../generated/graphql';

export const useIsAuth = () => {
  const [{ data, fetching }] = useProfileQuery();

  const router = useRouter();

  useEffect(() => {
    console.log({ fetching, data, router });
    if (!fetching && !data?.profile?.user) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [fetching, data, router]);
};
