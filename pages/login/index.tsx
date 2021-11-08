import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import { useLoginMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import styles from './Login.module.css';

interface loginProps {}

interface FormData {
  usernameOrEmail: string;
  password: string;
}

const schema = yup.object().shape({
  usernameOrEmail: yup
    .string()
    .required('Username or email is required!')
    .min(3, 'Username or email length must larger than 2!'),
  password: yup
    .string()
    .required('Password is required!')
    .min(3, 'Password length must larger than 2!'),
});

const Login: NextPage<loginProps> = () => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [responseErrors, setResponseErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const [, login] = useLoginMutation();

  const router = useRouter();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ usernameOrEmail, password }: FormData) => {
    setIsSubmiting(true);

    const response = await login({ usernameOrEmail, password });
    if (response.data?.login.errors) {
      setResponseErrors(toErrorMap(response.data.login.errors));
    } else if (response.data?.login.user) {
      router.push('/');
    }

    setIsSubmiting(false);
  };

  return (
    <form className={styles.login} onSubmit={handleSubmit(onSubmit)}>
      <InputField
        displayName="Username or Email"
        fieldName="usernameOrEmail"
        fieldType="text"
        errors={errors}
        placeholder="Enter your username or email!"
        register={registerForm}
        responseError={responseErrors?.usernameOrEmail}
      />
      <InputField
        displayName="Password"
        fieldName="password"
        fieldType="password"
        errors={errors}
        placeholder="Enter your password!"
        register={registerForm}
        responseError={responseErrors?.password}
      />
      <Button
        mt={4}
        colorScheme="facebook"
        type="submit"
        isLoading={isSubmiting}
      >
        Login
      </Button>
    </form>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
