import { NextPage } from "next";
import React, { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import styles from "./Register.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface registerProps { }

interface FormData {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required!").min(3, 'Username length must larger than 2!'),
  password: yup.string().required("Password is required!").min(3, 'Password length must larger than 2!'),
  retypedPassword: yup
    .string()
    .required("Retyped password is required!")
    .oneOf([yup.ref("password"), 'notmatched'], "Password does not match!"),
});

const Register: NextPage<registerProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log({ errors });
  }, [errors])

  const onSubmit = ({ username, password }: FormData) => {
    console.log({ username, password });
  };

  return (
    <form className={styles.register} onSubmit={handleSubmit(onSubmit)}>
      <FormControl width="50%" id="username" isInvalid={errors?.username} isRequired>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          {...register("username")}
          placeholder="Enter ur username!"
          name="username"
          type="text"
        />
        <FormErrorMessage>
          {errors.username?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl width="50%" id="password" isInvalid={errors?.password} isRequired>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          {...register("password")}
          placeholder="Enter ur password!"
          name="password"
          type="password"
        />
        <FormErrorMessage>
          {errors.password?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl width="50%" id="retypedPassword" isInvalid={errors?.retypedPassword} isRequired>
        <FormLabel htmlFor="retypedPassword">Retype password</FormLabel>
        <Input
          {...register("retypedPassword")}
          placeholder="Retype your password!"
          name="retypedPassword"
          type="password"
        />
        <FormErrorMessage>
          {errors.retypedPassword?.message}
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme="facebook" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default Register;
