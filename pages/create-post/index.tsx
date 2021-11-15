import { Button } from '@chakra-ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputField from '../../components/InputField';
import MainLayout from '../../components/MainLayout';
import { useCreatePostMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useIsAuth } from '../../utils/hooks/useIsAuth';
import styles from './create-post.module.css';

interface FormData {
  title: string;
  text: string;
}

const schema = yup.object().shape({
  title: yup.string().required('Username or email is required!'),
  text: yup.string().required('Password is required!'),
});

const CreatePost: NextPage = () => {
  useIsAuth();

  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [responseErrors, setResponseErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const [, createPost] = useCreatePostMutation();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const onSubmit = async ({ text, title }: FormData) => {
    setIsSubmiting(true);
    const { error } = await createPost({ input: { text, title } });
    setIsSubmiting(false);
    if (error) {
      console.log({ error });
    } else {
      router.push('/');
    }
  };

  return (
    <MainLayout>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <InputField
          displayName="Title"
          fieldName="title"
          fieldType="text"
          errors={errors}
          placeholder="Enter post title!"
          register={registerForm}
          responseError={responseErrors?.title}
        />
        <InputField
          displayName="Content"
          fieldName="text"
          fieldType="text"
          errors={errors}
          placeholder="Enter your content!"
          register={registerForm}
          responseError={responseErrors?.text}
          isMultiLine={true}
        />
        <Button
          mt={4}
          colorScheme="facebook"
          type="submit"
          isLoading={isSubmiting}
        >
          Create
        </Button>
      </form>
    </MainLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
