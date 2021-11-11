import { NextPage } from 'next';
import React, { useState } from 'react';
import styles from './forgot-password.module.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import InputField from '../../components/InputField';
import { Button } from '@chakra-ui/button';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useForgotPasswordMutation } from '../../generated/graphql';
import { Box } from '@chakra-ui/layout';

interface FormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Username or email is required!')
    .min(3, 'Username or email length must larger than 2!')
    .email('Invalid email type!'),
});

const ForgotPassword: NextPage = () => {
  const [complete, setComplete] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const [{}, forgotPassword] = useForgotPasswordMutation();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email }: FormData) => {
    setIsSubmiting(true);
    await forgotPassword({ email });
    setComplete(true);
    setIsSubmiting(false);
  };

  return (
    <>
      {!complete ? (
        <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
          <InputField
            displayName="email"
            fieldName="email"
            fieldType="text"
            errors={errors}
            placeholder="Enter your email!"
            register={registerForm}
          />
          <Button
            mt={4}
            colorScheme="facebook"
            type="submit"
            isLoading={isSubmiting}
          >
            Forgot Password
          </Button>
        </form>
      ) : (
        <Box>We already send an valid link to your email! Please check!</Box>
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(ForgotPassword);
