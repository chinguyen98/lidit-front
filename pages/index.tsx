import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import MainLayout from '../components/MainLayout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/layout';

const Home: NextPage = () => {
  const [{ data }] = usePostsQuery();

  return (
    <MainLayout>
      <div>DASHBOARD</div>
      <NextLink href="/create-post">
        <Link>Create new post</Link>
      </NextLink>
      <br />
      <br />
      <div>
        {!data ? (
          <div>loading.....</div>
        ) : (
          data.posts.map((post) => (
            <div key={`post-${post.id}`}>{post.title}</div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
