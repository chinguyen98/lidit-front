import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../../components/InputField';
import * as yup from 'yup';
import styles from './change-password.module.css';
import { Button } from '@chakra-ui/button';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { Box, Link } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';

interface FormData {
  newPassword: string;
}

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [responseErrors, setResponseErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const [{}, changePassword] = useChangePasswordMutation();

  const router = useRouter();

  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .required('New password is required!')
      .min(3, 'Password length must larger than 2!'),
  });

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ newPassword }: FormData) => {
    const response = await changePassword({ token, newPassword });
    if (response?.data?.changePassword?.errors) {
      const errorMap = toErrorMap(response?.data?.changePassword?.errors);
      setResponseErrors(errorMap);
    } else {
      router.push('/');
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <InputField
        displayName="New Password"
        fieldName="newPassword"
        fieldType="password"
        errors={errors}
        placeholder="Enter your new password!"
        register={registerForm}
        responseError={responseErrors?.newPassword}
      />
      {responseErrors?.token && (
        <Box>
          <Box color="red">{responseErrors?.token}</Box>
          <NextLink href="/forgot-password">
            <Link>Click here to get a new one!</Link>
          </NextLink>
        </Box>
      )}

      <Button
        mt={4}
        colorScheme="facebook"
        type="submit"
        isLoading={isSubmiting}
      >
        Change Password
      </Button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      token: query.token,
    },
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
