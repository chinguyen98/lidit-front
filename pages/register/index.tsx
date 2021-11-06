import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import { useRegisterMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import styles from './Register.module.css';

interface registerProps {}

interface FormData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required!')
    .min(3, 'Username length must larger than 2!'),
  password: yup
    .string()
    .required('Password is required!')
    .min(3, 'Password length must larger than 2!'),
  retypedPassword: yup
    .string()
    .required('Retyped password is required!')
    .oneOf([yup.ref('password'), 'notmatched'], 'Password does not match!'),
});

const Register: NextPage<registerProps> = () => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [responseErrors, setResponseErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const [, register] = useRegisterMutation();

  const router = useRouter();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ username, password }: FormData) => {
    setIsSubmiting(true);
    const response = await register({ username, password });
    if (response.data?.register.errors) {
      setResponseErrors(toErrorMap(response.data.register.errors));
    } else if (response.data?.register.user) {
      router.push('/');
    }
    setIsSubmiting(false);
  };

  return (
    <form className={styles.register} onSubmit={handleSubmit(onSubmit)}>
      <InputField
        displayName="Username"
        fieldName="username"
        fieldType="text"
        errors={errors}
        placeholder="Enter your username!"
        register={registerForm}
        responseError={responseErrors?.username}
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
      <InputField
        displayName="Retype password"
        fieldName="retypedPassword"
        fieldType="password"
        errors={errors}
        placeholder="Retype your password!"
        register={registerForm}
      />
      <Button
        mt={4}
        colorScheme="facebook"
        type="submit"
        isLoading={isSubmiting}
      >
        Register
      </Button>
    </form>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
