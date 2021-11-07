import { Button } from '@chakra-ui/button';
import { Box, Flex, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';
import React, { FC } from 'react';
import { useLogoutMutation, useProfileQuery } from '../../generated/graphql';
import { isServer } from '../../utils/isServer';

interface navbarProps {}

const Navbar: FC<navbarProps> = () => {
  const [{ data, fetching }] = useProfileQuery({
    pause: isServer(),
  });
  const [{ fetching: isLogoutFetching }, logout] = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  let body = null;

  if (fetching) {
  } else if (!data?.profile?.user) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr="2">
            Login
          </Link>
        </NextLink>
        <NextLink href="register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else if (data.profile.user) {
    body = (
      <Flex>
        <Box mr="4">{data?.profile?.user?.username}</Box>
        <Button
          onClick={handleLogout}
          isLoading={isLogoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p="4">
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default Navbar;
