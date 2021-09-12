import { NextPage } from "next";
import React, { useEffect, useState } from "react";
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
import InputField from "../../components/InputField";

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
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

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
    setIsSubmiting(true);
    console.log({ username, password });
  };

  return (
    <form className={styles.register} onSubmit={handleSubmit(onSubmit)}>
      <InputField
        displayName="Username"
        fieldName="username"
        fieldType="text"
        errors={errors}
        placeholder="Enter your username!"
        register={register}
      />
      <InputField
        displayName="Password"
        fieldName="password"
        fieldType="password"
        errors={errors}
        placeholder="Enter your password!"
        register={register}
      />
      <InputField
        displayName="Retype password"
        fieldName="retypedPassword"
        fieldType="password"
        errors={errors}
        placeholder="Retype your password!"
        register={register}
      />
      <Button mt={4} colorScheme="facebook" type="submit" isLoading={isSubmiting}>
        Register
      </Button>
    </form>
  );
};

export default Register;
