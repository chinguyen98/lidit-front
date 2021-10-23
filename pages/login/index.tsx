import { NextPage } from "next";
import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import styles from "./Login.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../../components/InputField";
import { useRouter } from "next/dist/client/router";
import { useLoginMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

interface loginProps { }

interface FormData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required!").min(3, 'Username length must larger than 2!'),
  password: yup.string().required("Password is required!").min(3, 'Password length must larger than 2!'),
});

const Login: NextPage<loginProps> = () => {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [responseErrors, setResponseErrors] = useState<Record<string, string> | null>(null);

  const [, login] = useLoginMutation();

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

    const response = await login({ options: { username, password } });
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
      <Button mt={4} colorScheme="facebook" type="submit" isLoading={isSubmiting}>
        Login
      </Button>
    </form>
  );
};

export default Login;
