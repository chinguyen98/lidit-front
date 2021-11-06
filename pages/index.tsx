import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Navbar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Home: NextPage = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Navbar />
      <div>Hello I'm Next!</div>
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
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
